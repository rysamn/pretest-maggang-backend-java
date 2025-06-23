# Soal test maggang Backend engineer dengan Springboot

Berikut adalah soal/pertanyaan yang perlu dijawab oleh peserta maggang

## knowledge base

1. Apa yang anda ketahui tentang Rest API?


REST API (Representational State Transfer - Application Programming Interface) adalah standar arsitektur web yang digunakan untuk membangun layanan web yang ringan dan dapat diakses melalui HTTP.

2. Apa yang anda ketahui tentang Server side and Client side processing?

Client-side processing adalah proses yang dilakukan di sisi pengguna, biasanya menggunakan JavaScript untuk menangani interaksi antarmuka seperti validasi form atau animasi. Proses ini cepat karena tidak perlu komunikasi dengan server, namun kurang aman untuk logika penting.
Server-side processing dilakukan di server, menggunakan bahasa seperti Java, PHP, atau Python. Cocok untuk logika bisnis, akses database, dan otentikasi karena lebih aman dan terkontrol, meskipun bisa lebih lambat karena melibatkan komunikasi dengan server.

3. Apa yang anda ketahui tentang Monolith dan Microservices, berikan contohnya?

Monolith dan microservices adalah dua arsitektur dalam pengembangan aplikasi. Monolith adalah arsitektur di mana seluruh komponen aplikasi (seperti user, produk, pembayaran, dan lainnya) dibangun dalam satu kesatuan proyek dan dijalankan sebagai satu layanan. Pendekatan ini lebih sederhana untuk pengembangan awal dan cukup dengan satu kali deployment, namun seiring bertambahnya kompleksitas aplikasi, monolith bisa menjadi sulit untuk diskalakan dan dipelihara. Sebaliknya, microservices memecah aplikasi menjadi layanan-layanan kecil yang independen, di mana setiap layanan memiliki tanggung jawab spesifik, dapat dikembangkan dan dideploy secara terpisah. Contohnya, dalam aplikasi e-commerce, bisa ada layanan terpisah untuk otentikasi, katalog produk, dan pemesanan. Arsitektur ini memudahkan skalabilitas dan pengelolaan tim, namun lebih kompleks karena membutuhkan koordinasi antar layanan dan infrastruktur tambahan seperti API Gateway dan service discovery.

4. Apa yang anda ketahui tentang Design pattern inversion of Control serta Dependency Injection?

Inversion of Control (IoC) adalah prinsip desain di mana alur kontrol pembuatan dan pengelolaan objek dialihkan dari kode aplikasi ke framework, sehingga objek tidak saling membuat satu sama lain secara langsung. Salah satu implementasi paling umum dari IoC adalah Dependency Injection (DI). Dengan DI, objek tidak lagi membuat dependensi yang dibutuhkan sendiri, melainkan disediakan atau "disuntikkan" dari luar oleh framework seperti Spring. Hal ini membuat kode lebih modular, mudah diuji, dan fleksibel untuk dikembangkan. Sebagai contoh, dalam aplikasi Java dengan Spring Boot, kita cukup menandai kelas dengan anotasi seperti @Service dan @Autowired, lalu Spring secara otomatis akan mengatur dan menyuntikkan objek yang dibutuhkan tanpa perlu membuat instance secara manual.

5. Apa yang anda ketahui tentang Java programming dan Spring framework khususnya spring-boot?

Java adalah Bahasa pemrograman OOP (berbasis objek). Sering digunakan luas untuk aplikasi web, desktop, dan mobile (Android). Memiliki fitur seperti inheritance, polymorphism, encapsulation, exception handling. Spring adalah Framework Java yang digunakan untuk membangun aplikasi enterprise (web, batch, security). Spring fokus pada pengelolaan dependency, modularisasi, dan testability.Spring Boot adalah ekstensi dari Spring yang membuat aplikasi stand-alone dengan konfigurasi minimal.

## Design modules

Dalam suatu schenario ada requirement membuat aplikasi e-commerse seperti Tokopedia seperti berikut:

1. Catalog, pelanggan mencari product di toko
    ![catalog](imgs/catalog.png)
2. Item, bisa melihat detail informasi produk
    ![items](imgs/item.png)
3. Cart, pelanggan bisa menambahkan produk yang ingin di beli ke keranjang
    ![cart](imgs/cart.png)
4. Setelah di checkout, masuk ke list transaction
    ![list-transaction](imgs/list-transaction.png)
5. Kita juga bisa liat detail transactionya
    ![detail-transaction](imgs/detail-transaction.png)

Kemudian temen-temen buat design database, module (monolith/microservices) berdasarkan gambar atau schenario tersebut. Serta jelakan mengapa menggunakan design tersebut.

## Praktek

Berdasarkan analisa tersebut, buat project monorepo (pada repository ini) dengan menggunakan framework springboot seperti berikut specifikasinya:

- Database: `PostgreSQL 15`
- JDK version: `Oracle JDK 17 or later`
- Springboot version: `3.0.x`

terkait design system Toko, Barang, Pembelian pada ecommerse tersebut.
