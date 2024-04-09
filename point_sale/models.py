from django.db import models
from datetime import date
from django.utils.translation import gettext as _

class Category(models.Model):
    """ Category  model"""
    category_code  = models.CharField(
        max_length = 20,
        help_text = "The category's code.")
    category_name = models.CharField(
        max_length = 15,
        help_text = "The category's name.")
    def __str__(self):
        return self.category_name

class Group(models.Model):
    """ Group model """
    group_code = models.CharField(
        max_length = 8,
        help_text = "The group's code")
    def __str__(self):
        return self.group_code

class Product(models.Model):
    """ Main model """
    product_code = models.CharField(
        max_length = 20,
        help_text = "The product's barcode.")
    category = models.ForeignKey(
        Category,
        on_delete = models.CASCADE,
        help_text = "The product's category")
    group = models.ForeignKey(
        Group,
        on_delete = models.CASCADE,
        help_text = "The product's group.")
    product_name = models.CharField(
        max_length = 50,
        help_text = "The product's name.")
    product_description = models.TextField(
        max_length = 50,
        help_text = "The product's description.")
    product_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text = "The current rate.")
    has_attribute = models.BooleanField(
        default = False,
        help_text = "Has attributes?")
    is_active = models.BooleanField(
        default = False,
        help_text = "Is active?.")
    def __str__(self):
        return self.product_name

class ProductAttributeType(models.Model):
    attribute_name = models.CharField(max_length=25)
    def __str__(self):
        return self.attribute_name

class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    attribute = models.ForeignKey(ProductAttributeType, on_delete=models.CASCADE)
    def __str__(self):
        return '{}-{}'.format(self.product.product_name, self.attribute.attribute_name)

class ProductAttributeValue(models.Model):
    product_attribute = models.ForeignKey(ProductAttribute,on_delete=models.CASCADE)
    attribute_value = models.CharField(max_length=25)
    def __str__(self):
        return self.product_attribute.product.product_name

class ProductLot(models.Model):
    lot_code = models.CharField(max_length = 20)
    date_expiry = models.DateField(_("Date"), default = date.today)
    def __str__(self):
        return self.lot_code

class Product_oum(models.Model):
    uom_name = models.CharField(max_length=50)
    def __str__(self):
        return self.uom_name

class Supplier(models.Model):
    supplier_name = models.CharField(max_length=50)
    def __str__(self):
        return self.supplier_name

class PurchaseOrderHeader(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add = True)
    total_amount = models.DecimalField(max_digits=5, decimal_places=2)
    def __str__(self):
        return self.purchase_date

class PurchaseOrderLine(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrderHeader, verbose_name=_(""), on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.IntegerField()
    def __str__(self):
        return '{}-{}'.format(self.product, self.purchase_order.__str__)

class ProductPriceRecords(models.Model):
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    from_date = models.DateTimeField(auto_now_add=True)
    product_price = models.DecimalField(max_digits=5,decimal_places=2)
    def __str__(self):
        return '{}-{}'.format(self.product, self.from_date)

class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    sale_date = models.DateTimeField(auto_now=False, auto_now_add=True)
    def __str__(self):
        return self.product.product_name