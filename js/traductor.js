const translateWord = async (word, fromLang = 'fr', toLang = 'en') => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${fromLang}|${toLang}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return {
          success: true,
          translation: data.responseData.translatedText
        };
      } else {
        return {
          success: false,
          error: 'Erreur de traduction'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion'
      };
    }
  };
  
  // Exemple d'utilisation
  const word = 'bonjour';
  translateWord(word)
    .then(result => {
      if (result.success) {
        console.log(`Traduction: ${result.translation}`);
      } else {
        console.error(`Erreur: ${result.error}`);
      }
    });