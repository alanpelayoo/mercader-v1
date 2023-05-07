from django.urls import path
from base.views import product_views 

urlpatterns = [
    path('', product_views.getProducts, name="products"),

    path('create/', product_views.createProduct, name="create-product"),
    path('upload/', product_views.uploadImage, name="upload-iamge"),
    
    path('advertisement/', product_views.getAdvertisemntProducts, name="advertisement"),

    path('<str:pk>/reviews/', product_views.createProductReview, name="review"),
    path('<str:pk>/', product_views.getProduct, name="product"),
    
    path('update/<str:pk>/', product_views.updateProduct, name="update-product"),
    path('delete/<str:pk>/', product_views.deleteProduct, name="delete-product"),
]