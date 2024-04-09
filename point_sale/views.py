from django.shortcuts import render, get_object_or_404, HttpResponse
from django.http import JsonResponse
from .models import (Product, Sale, ProductAttribute, ProductAttributeValue, ProductAttributeType)
import json
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
def index(request):
    return render(request, 'point_sale/index.html')
def cash(request):
    return render(request, 'point_sale/cash.html')


# CASH

def barcode(request):
    bc = request.GET.get('value')
    product = get_object_or_404(Product, product_code = bc)

    context = {
        'id':product.pk,
        'name':getFullName(product),
        'price':product.product_price,
        'granel': product.group.group_code == 'granel'
    }

    return JsonResponse(context)



def getFullName(product):
    try:
        # Obtiene todos los atributos asociados al producto
        product_attributes = ProductAttribute.objects.filter(product=product)
        
        # Inicializa una lista para almacenar los nombres de los atributos y sus valores
        attribute_values = []
        
        # Recorre todos los atributos asociados al producto
        for product_attribute in product_attributes:
            # Obtiene el nombre del atributo
            attribute_name = product_attribute.attribute.attribute_name
            
            try:
                # Intenta obtener el valor del atributo para el producto actual
                attribute_value = ProductAttributeValue.objects.get(product_attribute=product_attribute).attribute_value
            except ObjectDoesNotExist:
                # Si no se encuentra un valor para el atributo, se asigna un valor vacío
                attribute_value = "N/A"
            
            # Concatena el nombre del atributo y su valor
            attribute_values.append(f"{attribute_name}: {attribute_value}")
        
        # Retorna el nombre del producto concatenado con los valores de los atributos
        return f"{product.product_name} - {' | '.join(attribute_values)}"
    
    except ObjectDoesNotExist:
        # Si no se encuentran atributos asociados al producto, se maneja el error retornando el nombre del producto solamente
        return product.product_name


def query(request):
    name = request.GET.get('value')
    products = Product.objects.filter(product_name__contains=name)
    context = []

    for product in products:
        context.append({
            'id':product.pk,
            'name':(getFullName(product) ),
            'price':product.product_price,
            'granel': product.group.group_code == 'granel'
        })

        
    
    return JsonResponse({'products' : context})

def addSale(request):
    data = json.loads(request.body)
    
    for dato in data:
        product_id = dato['id']
        importe = dato['importe']

        product = get_object_or_404(Product, pk = product_id)
        Sale.objects.create(product = product, amount = importe)

    
    return HttpResponse(200)

#sales

def salesList(request):
    sales = Sale.objects.all()
    sale_list = []

    for sale in sales:
        sale_list.append({
            'date': sale.sale_date,
            'product': sale.product,
            'price':sale.product.product_price,
            'quantity': (sale.amount / sale.product.product_price),
            'mount': sale.amount
        })

    context ={
        'sale_list': sale_list
    }

    return render(request, 'point_sale/sales.html', context)