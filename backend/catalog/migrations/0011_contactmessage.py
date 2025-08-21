from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0010_productoffer_quantity_alter_productoffer_offer_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100, verbose_name='Ad')),
                ('last_name', models.CharField(max_length=100, verbose_name='Soyad')),
                ('email', models.EmailField(max_length=254, verbose_name='E-poçt')),
                ('phone', models.CharField(blank=True, max_length=30, verbose_name='Telefon')),
                ('subject', models.CharField(choices=[('product-inquiry', 'Məhsul haqqında sual'), ('technical-support', 'Texniki dəstək'), ('complaint', 'Şikayət'), ('suggestion', 'Təklif'), ('partnership', 'Əməkdaşlıq'), ('other', 'Digər')], max_length=50, verbose_name='Mövzu')),
                ('message', models.TextField(verbose_name='Mesaj')),
                ('privacy_accepted', models.BooleanField(default=False, verbose_name='Məxfilik qəbul edildi')),
                ('status', models.CharField(choices=[('new', 'Yeni'), ('read', 'Oxunub'), ('archived', 'Arxivləndi')], default='new', max_length=20, verbose_name='Status')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Göndərilmə tarixi')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Yenilənmə tarixi')),
            ],
            options={
                'verbose_name': 'Əlaqə Mesajı',
                'verbose_name_plural': 'Əlaqə Mesajları',
                'ordering': ['-created_at'],
            },
        ),
    ]
