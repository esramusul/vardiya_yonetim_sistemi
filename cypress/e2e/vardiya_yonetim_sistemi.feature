Feature: Vardiya Yönetim Sistemi
  Vardiya yönetimini tek sayfa üzerinden yapabilmek

  Scenario: Admin tüm vardiya akışını tamamlar
    Given vardiya yönetim sayfasındayım
    When "admin@example.com" e-posta ve "123456" şifre ile giriş yaparım
    Then sistemde oturum açmış olmalıyım
    And sayfa başlığı "Vardiya Yönetim Sistemi" görünmelidir

    When "Öğretim" departmanını oluştururum
    Then departman listesinde "Öğretim" görünmelidir

    When departman "Öğretim" için "Ahmet Yılmaz" çalışanını oluştururum
    Then çalışan listesinde "Ahmet Yılmaz" görünmelidir

    When "Sabah Vardiyası" vardiya şablonunu "08:00" ve "16:00" saatleriyle oluştururum
    Then vardiya şablonları listesinde "Sabah Vardiyası" görünmelidir

    When "Ahmet Yılmaz" çalışanına "Sabah Vardiyası" şablonunu "2025-11-10" tarihi için atarım
    Then "Ahmet Yılmaz" çalışanının "2025-11-10" tarihli vardiyasında "Sabah Vardiyası" görünmelidir

