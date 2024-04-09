from django.contrib import admin

class jrAdminSite(admin.AdminSite):
    title_header = 'JR Admin'
    site_header = 'JR Administration'
    index_title = 'JR site admin'