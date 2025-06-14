document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authButton = document.getElementById('authButton');
    const toggleAuthModeButton = document.getElementById('toggleAuthMode');
    const authTitle = document.getElementById('authTitle');
    const errorMessageDiv = document.getElementById('errorMessage');

    let isLoginMode = true; // Başlangıçta giriş modu

    // Firebase Auth referansı
    const auth = firebase.auth();

    // Firebase Auth durumunda bir değişiklik olduğunda dinle
    auth.onAuthStateChanged(user => {
        if (user) {
            // Kullanıcı zaten giriş yapmışsa, onu proje listesi sayfasına yönlendir
            window.location.href = 'index.html'; // index.html henüz proje listesi değil, ama şimdilik oraya yönlendirelim
        }
    });

    // Giriş/Kayıt modunu değiştirme
    toggleAuthModeButton.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Giriş Yap';
            authButton.textContent = 'Giriş Yap';
            toggleAuthModeButton.textContent = 'Hesabın yok mu? Kayıt ol';
        } else {
            authTitle.textContent = 'Kayıt Ol';
            authButton.textContent = 'Kayıt Ol';
            toggleAuthModeButton.textContent = 'Zaten hesabın var mı? Giriş yap';
        }
        errorMessageDiv.textContent = ''; // Mod değiştiğinde hata mesajını temizle
    });

    // Form gönderildiğinde (Giriş Yap veya Kayıt Ol)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

        const email = emailInput.value;
        const password = passwordInput.value;
        errorMessageDiv.textContent = ''; // Önceki hata mesajını temizle

        if (isLoginMode) {
            // Giriş Yapma
            try {
                await auth.signInWithEmailAndPassword(email, password);
                console.log('Kullanıcı giriş yaptı!');
                window.location.href = 'index.html'; // Başarılı girişte index.html'ye yönlendir
            } catch (error) {
                console.error('Giriş hatası:', error.message);
                errorMessageDiv.textContent = 'Giriş başarısız: ' + getTurkishErrorMessage(error.code);
            }
        } else {
            // Kayıt Olma
            try {
                await auth.createUserWithEmailAndPassword(email, password);
                console.log('Yeni kullanıcı kaydedildi!');
                // Başarılı kayıttan sonra doğrudan giriş yapılmış kabul edilebilir
                window.location.href = 'index.html'; // Başarılı kayıtta index.html'ye yönlendir
            } catch (error) {
                console.error('Kayıt hatası:', error.message);
                errorMessageDiv.textContent = 'Kayıt başarısız: ' + getTurkishErrorMessage(error.code);
            }
        }
    });

    // Firebase hata kodlarını Türkçe'ye çevirme
    function getTurkishErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Bu e-posta adresi zaten kullanılıyor.';
            case 'auth/invalid-email':
                return 'Geçersiz e-posta adresi.';
            case 'auth/operation-not-allowed':
                return 'E-posta/Şifre ile giriş etkin değil. Lütfen yöneticinize başvurun.';
            case 'auth/weak-password':
                return 'Şifre en az 6 karakter olmalıdır.';
            case 'auth/user-disabled':
                return 'Bu kullanıcı hesabı devre dışı bırakılmıştır.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Geçersiz e-posta veya şifre.';
            case 'auth/network-request-failed':
                return 'İnternet bağlantısı sorunu. Lütfen bağlantınızı kontrol edin.';
            default:
                return 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.';
        }
    }
});
