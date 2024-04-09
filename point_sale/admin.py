from django.contrib import admin
from .models import (Product, Group, Category, ProductAttribute, Sale, ProductAttributeType, ProductAttributeValue, ProductLot, Product_oum, Supplier, PurchaseOrderHeader, PurchaseOrderLine, ProductPriceRecords) 
# Register your models here.

class ProductsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Product._meta.fields]
    search_fields = ('product_name', 'product_code')
admin.site.register(Product, ProductsAdmin)

class GroupAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Group._meta.fields]
admin.site.register(Group)

class CategoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Category._meta.fields]
admin.site.register(Category)

class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductAttribute._meta.fields]
admin.site.register(ProductAttribute, ProductAttributeAdmin)

class ProductAttributeTypeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductAttributeType._meta.fields]
admin.site.register(ProductAttributeType)

class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductAttributeValue._meta.fields]
admin.site.register(ProductAttributeValue, ProductAttributeValueAdmin)

class ProductLotAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductLot._meta.fields]
admin.site.register(ProductLot)

class Product_oumAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Product_oum._meta.fields]
admin.site.register(Product_oum)

class SupplierAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Supplier._meta.fields]
admin.site.register(Supplier)

class PurchaseOrderHeaderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in PurchaseOrderHeader._meta.fields]
admin.site.register(PurchaseOrderHeader)

class PurchaseOrderLineAdmin(admin.ModelAdmin):
    list_display = [field.name for field in PurchaseOrderLine._meta.fields]
admin.site.register(PurchaseOrderLine)

class ProductPriceRecordsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ProductPriceRecords._meta.fields]
admin.site.register(ProductPriceRecords)

class SaleAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Sale._meta.fields]
admin.site.register(Sale, SaleAdmin)

