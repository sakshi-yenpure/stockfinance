from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    api_key = models.CharField(max_length=50, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email


class Stock(models.Model):
    """Model to store stock data fetched from yfinance"""
    symbol = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=50)
    current_price = models.FloatField()
    change = models.FloatField(default=0)
    change_percent = models.FloatField(default=0)
    day_high = models.FloatField(default=0)
    day_low = models.FloatField(default=0)
    pe_ratio = models.FloatField(default=0)
    market_cap = models.BigIntegerField(default=0)
    volume = models.BigIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stocks'
        ordering = ['-last_updated']

    def __str__(self):
        return f"{self.symbol} - {self.name}"


class PortfolioStock(models.Model):
    """Model to store user's portfolio stocks organized by sector"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolio_stocks')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    sector = models.CharField(max_length=50)  # Sector from which stock was added
    quantity = models.IntegerField(default=1)
    buying_price = models.FloatField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'portfolio_stocks'
        unique_together = ('user', 'stock')
        ordering = ['sector', 'stock__symbol']

    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol} ({self.sector})"