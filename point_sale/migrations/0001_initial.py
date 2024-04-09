# Generated by Django 5.0.3 on 2024-03-16 15:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_code', models.CharField(help_text="The category's code.", max_length=8)),
                ('category_name', models.CharField(help_text="The category's name.", max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_code', models.CharField(help_text="The group's code", max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_code', models.CharField(help_text="The product's barcode.", max_length=8)),
                ('product_name', models.CharField(help_text="The product's name.", max_length=50)),
                ('product_description', models.TextField(help_text="The product's description.", max_length=50)),
                ('product_price', models.DecimalField(decimal_places=2, help_text='The current rate.', max_digits=10)),
                ('has_attribute', models.BooleanField(default=False, help_text='Has attributes?')),
                ('is_active', models.BooleanField(default=False, help_text='Is active?.')),
                ('category', models.ForeignKey(help_text="The product's category", on_delete=django.db.models.deletion.CASCADE, to='point_sale.category')),
                ('group', models.ForeignKey(help_text="The product's group.", on_delete=django.db.models.deletion.CASCADE, to='point_sale.group')),
            ],
        ),
        migrations.CreateModel(
            name='ProductAttribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attribute', models.CharField(choices=[('ENVASE', 'envase'), ('CONTENIDO', 'contenido'), ('COLOR', 'color'), ('VARIANTE', 'variante')], max_length=20, verbose_name='The attribute this product has.')),
                ('value', models.CharField(max_length=20)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='point_sale.product')),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=5)),
                ('total', models.DecimalField(decimal_places=2, max_digits=5)),
                ('date_created', models.DateTimeField(auto_now_add=True, help_text='The date and time the review was created.')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='point_sale.product')),
            ],
        ),
    ]
