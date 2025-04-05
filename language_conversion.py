import googletrans
from googletrans import Translator

def display_languages():
    print("Available languages:")
    for lang_code, lang_name in googletrans.LANGUAGES.items():
        print(f"{lang_code}: {lang_name}")

def main():
    translator = Translator()
    
    print("Welcome to the Language Translator!")
    
    # Display available languages
    display_languages()
    
    # Get user input
    text_to_translate = input("Enter the text you want to translate: ")
    target_language = input("Enter the language code you want to translate to (e.g., 'es' for Spanish): ")
    
    # Translate the text
    try:
        translated = translator.translate(text_to_translate, dest=target_language)
        print(f"Translated text: {translated.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()