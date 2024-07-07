import sqlite3
import requests
import time, os, re
from typing import Tuple
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from geopy.geocoders import Nominatim
from youtubesearchpython import VideosSearch

def connection_open(db_path) -> Tuple[sqlite3.Connection, sqlite3.Cursor]:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    return connection, cursor

def connection_close(connection: sqlite3.Connection, cursor: sqlite3.Cursor):
    return cursor.close(), connection.close()

def create_database(sql_path, db_path):
    with open(sql_path, "r", encoding="utf-8") as file:
        sql_commands = file.read()
        
    connection, cursor = connection_open(db_path)
    try:
        cursor.executescript(sql_commands)
        connection.commit()
    except sqlite3.Error as e:
        print(f"Error creating database: {e}")
    finally:
        connection.close()
        
def check_existing(table_name, column, value):
    connection, cursor = connection_open("database/database.db")
    cursor.execute(f"""SELECT exists(SELECT 1 FROM {table_name} WHERE {column}=?) AS row_check;""", (value,))
    if cursor.fetchone()[0]: 
        print(f"Skipped {value}, already exists in db")
        connection_close(connection, cursor)
        return True
    connection_close(connection, cursor)
    return False
    
    
def save(table):
    connection, cursor = connection_open("database/database.db")
    for value_group in zip(*table["values"]):
        cursor.execute(f"""INSERT INTO {table['name']}({', '.join(table['columns'])}) VALUES({', '.join(['?']*len(table['columns']))})""", value_group,)
    connection.commit()
    return connection_close(connection, cursor)

def get_wrestlers(html):
    soup = BeautifulSoup(html, 'html.parser')
    div = soup.find('div', { 'class': 'main-content' })
    wrestlers = div.find_all('a', { 'class': 'product-item-link' })
    for w in wrestlers:
        print("Found: ", w.attrs['href'])
        fetch(f'https://www.thesmackdownhotel.com{w.attrs["href"]}', f'wrestlers/{w.attrs["href"].split("/")[-1]}')
        time.sleep(1)

def get_coordinates(nominatim, location):
    coords = nominatim.geocode(location)
    original_loc = location
    while not coords:
        location = ", ".join(location.split(", ")[:-1])
        if not location: break
        coords = nominatim.geocode(location)
    location = original_loc
    while not coords:
        location = ", ".join(location.split(", ")[1:])
        if not location: break
        coords = nominatim.geocode(location)
    return coords

def get_wrestler_value(container, css_class, with_entry=False, num_outputs=1, split_sep=None):
    try:
        if with_entry:
            value = container.find('li', { 'class': css_class }).find('span', { 'class': 'field-entry' }).find('span', { 'class': 'field-value' }).get_text().strip()
        else:
            value = container.find('li', { 'class': css_class }).find('span', { 'class': 'field-value' }).get_text().strip()
        return value.split(split_sep) if split_sep else value
    except AttributeError:
        return "Unknown" if num_outputs == 1 else ["Unknown"] * num_outputs
        
    
def parse_wrestler(html):
    soup = BeautifulSoup(html, 'html.parser')
    container_personal = soup.find('ul', { 'class': 'fields-container' })
    container_career = soup.select('h2 + div > ul.fields-container')[1]
    
    name = container_personal.find('span', { 'class': 'name' }).get_text().strip()
    gender = get_wrestler_value(container_personal, 'gender')
    
    dob, age = map(lambda x: x.strip(), get_wrestler_value(container_personal, 'born', num_outputs=2, split_sep='('))
    age = re.sub('[^0-9]', "", age)
    if age == "": age = 0
    
    nom = Nominatim(user_agent="wrestler-db")
    birth_place = get_wrestler_value(container_personal, 'birth-place')
    billed_from = get_wrestler_value(container_personal, 'billed-from', with_entry=True)

    location = get_coordinates(nom, birth_place)
    if location:
        lat, long = location.latitude, location.longitude
        country = nom.reverse(f'{lat}, {long}', language='en').raw['address']['country']
    else:
        lat, long = 0, 0
        country = "Unknown"
    
    height_ft, height_cm = map(lambda x: re.sub("[()]", "", x), get_wrestler_value(container_personal, 'height', num_outputs=2, split_sep=' ('))
    
    try:
        weight_lbs, weight_kg = map(lambda x: re.sub("[()]", "", x), get_wrestler_value(container_personal, 'weight', num_outputs=2, split_sep=' ('))
    except ValueError:
        weight_lbs, weight_kg = map(lambda x: re.sub("[()]", "", x), get_wrestler_value(container_personal, 'weight', with_entry=True, num_outputs=2, split_sep=' ('))

    nicknames = get_wrestler_value(container_personal, 'nicknames')
    promotion = get_wrestler_value(container_career, 'companies', with_entry=True).replace('IMPACT', 'TNA')
    alignment = get_wrestler_value(container_career, 'alignments', with_entry=True)
    finisher = get_wrestler_value(soup, 'finishers', with_entry=True)
    theme_name = get_wrestler_value(soup, 'theme-songs', with_entry=True)
    try:
        theme_link = VideosSearch(f'{theme_name} {name} entrance theme', limit=1).result()['result'][0]['link']
    except IndexError:
        theme_link = VideosSearch(f"{name} entrance theme", limit=1).result()['result'][0]['link']
    return [[name], [age], [gender], [dob], [birth_place], [country], [lat], [long], [billed_from], [height_ft], [height_cm], [weight_lbs], [weight_kg], [nicknames], [promotion], [alignment], [finisher], [theme_link]]

def fetch(url, filename, wait_js=False, wait_selector=None):
    if wait_js:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            page.goto(url)
            page.wait_for_selector(wait_selector)

            html_content = page.content()
            with open(f'external/html/{filename}.html', 'w', encoding='utf-8') as file:
                file.write(html_content)
            browser.close()
            return html_content
    else:
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            html_content = ""
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    html_content += chunk.decode("utf-8", 'ignore')

            with open(f'external/html/{filename}.html', 'w', encoding='utf-8') as file:
                file.write(html_content)
            return html_content
        except requests.exceptions.RequestException as e:
            return print(f"Error fetching HTML: {e}")

if __name__ == "__main__":
    create_database('database/database.sql', 'database/database.db')
    wrestler_table = {
        "name": "Wrestlers",
        "columns": ["name", "age", "gender", "date_of_birth", "birth_place", "country", "latitude", "longitude", "billed_from", "height_ft", "height_cm", "weight_lbs", "weight_kg", "nicknames", "promotion", "alignment", "finisher", "theme_song"],
    }
    for i in range(1, 4):
        url = f"https://www.thesmackdownhotel.com/wrestlers/#sort=attr.ct176.frontend_value\
        &sortdir=asc&attr.ct39.value=wwe%2Caew%2Ctna\
        &attr.ct60.value=wrestler&page={i}".replace(" ", "")
        print(url)
        if not os.path.isfile(f'external/html/wrestlers_{i}.html'):
            wrestlers_html = fetch(url, f'wrestlers_{i}', True, '.product-items')
            get_wrestlers(wrestlers_html)
    wrestler_file_list = os.listdir('external/html/wrestlers')
    for wrestler_file in wrestler_file_list:
        with open(f'external/html/wrestlers/{wrestler_file}') as file:
            wrestler_html = file.read()
        print("Parsing ", wrestler_file)
        soup = BeautifulSoup(wrestler_html, 'html.parser')
        container_personal = soup.find('ul', { 'class': 'fields-container' })
        name = container_personal.find('span', { 'class': 'name' }).get_text().strip()
        if check_existing("Wrestlers", "name", name): continue
        output = parse_wrestler(wrestler_html)
        print("output: ", output)
        wrestler_table['values'] = output
        save(wrestler_table)