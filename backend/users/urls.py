from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('token/refresh/', views.refresh_token, name='token_refresh'),
    path('me/', views.get_current_user, name='current_user'),
    path('metals/prices/', views.get_live_metals_prices, name='live_metals_prices'),
    path('stocks/sector/<str:sector>/', views.get_sector_stocks, name='sector_stocks'),
    path('portfolio/add/', views.add_to_portfolio, name='add_to_portfolio'),
    path('portfolio/', views.get_portfolio, name='get_portfolio'),
    path('stocks/sector/<str:sector>/refresh/', views.refresh_sector_prices, name='refresh_sector_prices'),
    path('activities/', views.activity_dashboard, name='activity_dashboard'),
    path('newsletter/subscribe/', views.subscribe_newsletter, name='subscribe_newsletter'),
    path('payments/dummy/', views.process_dummy_payment, name='process_dummy_payment'),
]