export default defineNuxtRouteMiddleware((to) => {
	const config = useRuntimeConfig();
	const maintenanceMode = config.public.maintenanceMode;

	if (maintenanceMode && to.path !== '/maintenance') {
		return navigateTo('/maintenance');
	}
	if (!maintenanceMode && to.path === '/maintenance') {
		return navigateTo('/');
	}
});
