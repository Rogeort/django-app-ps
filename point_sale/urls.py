from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('cash/', views.cash, name='cash'),
    path('barcode/', views.barcode, name="Barcode"),
    path('query/', views.query, name="queryByBarcode"),
    path('addSale/', views.addSale, name="addSale"),
    path('', 
         TemplateView.as_view(template_name = 'point_sale/index.html')),
    path('sales/', views.salesList, name='salesList'),
]