from django import forms
from ..models.user import User

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form__input'}),
            'password': forms.PasswordInput(attrs={'class': 'form__input'}),
        }