# Complete E-Commerce Project

This is a complete e-commerce project based on **RESTful APIs**, providing a convenient and seamless shopping experience for users. The project is developed using **Node.js**, **Express**, **Mongoose**, and **MongoDB**.

## Features

- **Category and Subcategory Management**: Allows the admin to manage the store structure and organize products by categories.
- **Brand Management**: Ability to add, update, and remove different brands.
- **Product Management**: Provides the admin the ability to add, update, and delete products, with support for uploading one or more images for each product.
- **Coupon Management**: Ability to create and modify coupons to offer discounts to users.
- **User Management**: Allows the admin to manage user accounts and control their permissions.

## User Interface

- **Product Ratings**: Registered users can add and manage ratings for products.
- **Add to Cart and Favorites**: Users can add products to their cart or favorites list.
- **Checkout Process**: Support for completing purchases using cash payment.
- **Profile Update**: Users can update their account information.

## Visitor Experience

- Visitors can browse the available products, categories, and brands without the need to create an account.

## Security

Authentication is performed using **JWT** (JSON Web Token) to ensure data security and access control.

## Note

**To enable image uploads, create a folder structure as follows :**

- `storage`
  - `upload`
    - `images`
      - `brands`
      - `categories`
      - `products`
      - `users`

---

## Requirements

- Node.js
- MongoDB
- Mongoose
- Express

## How to Run

1. Clone the project to your device using Git.
2. Ensure all requirements are installed.
3. Start a local MongoDB server.
4. Use the following command to install the required packages:

   ```bash
   npm install
   ```

5. Start the server using:

   ```bash
   npm run dev
   ```

## Contributing

We welcome your contributions! If you would like to improve the project, please open a pull request or send us your feedback.

---

### Explanation of the `scripts` in the `package.json` File

```json
"scripts": {
    "dev": "nodemon config/server.js",
    "dev:db": "sudo docker compose up -d && nodemon config/server.js",
    "start:db": "sudo docker compose up -d",
    "stop:db": "sudo docker compose down",
    "prod": "APP_ENV=prod node config/server.js",
    "routers:list": "node tools/ListOfRoutes.js"
}
```

### Commands

1. **`dev`**:

   - **Description**: Starts the server in development mode using `nodemon`.
   - **Function**: Uses `nodemon` to watch for changes in the project files, and when any file is modified, it automatically restarts the server. It runs on `server.js` located in the `config` directory.

2. **`dev:db`**:

   - **Description**: Starts the database using Docker and then starts the server in development mode.
   - **Function**: This command runs the Docker services defined in the `docker-compose.yml` file (running them in the background using `-d`), and then starts the server using `nodemon`. The command requires root privileges (sudo).

3. **`start:db`**:

   - **Description**: Starts the database services using Docker.
   - **Function**: Runs the Docker services defined in `docker-compose.yml` in the background, preparing the database before starting the server.

4. **`stop:db`**:

   - **Description**: Stops all Docker services.
   - **Function**: Stops all containers that were started by Docker, effectively halting the database and any related services.

5. **`prod`**:

   - **Description**: Starts the server in production mode.
   - **Function**: Sets the environment variable `APP_ENV` to `prod` and then starts the server, indicating that the application is running in production mode.

6. **`routers:list`**:
   - **Description**: Displays a list of all routes in the application.
   - **Function**: Executes the `ListOfRoutes.js` file in the `tools` directory, which may contain logic to display all available routes in the application.

### Usage

You can run any of these commands using npm from the command line. For example, to run the server in development mode, you can type:

```bash
npm run dev
```

You can also use the `dev:db`, `start:db`, and `stop:db` commands to manage the database as needed.

# مشروع المتجر الإلكتروني المتكامل

هذا مشروع متجر إلكتروني متكامل يعتمد على **RESTful APIs**، حيث يوفر تجربة تسوق مريحة وسلسة للمستخدمين. تم تطوير هذا المشروع باستخدام **Node.js** و**Express** و**Mongoose** و**MongoDB**.

## المميزات

- **إدارة الأقسام والأقسام الفرعية**: يتيح للمدير إدارة هيكل المتجر وتنظيم المنتجات حسب الفئات.
- **إدارة الماركات**: إمكانية إضافة وتحديث وإزالة الماركات المختلفة.
- **إدارة المنتجات**: يوفر المدير القدرة على إضافة وتحديث وحذف المنتجات، مع دعم رفع صورة واحدة أو أكثر لكل منتج.
- **إدارة الكوبونات**: إمكانية إنشاء وتعديل الكوبونات لتقديم خصومات للمستخدمين.
- **إدارة المستخدمين**: يتيح للمدير إدارة حسابات المستخدمين والتحكم في صلاحياتهم.

## واجهة المستخدم

- **تقييمات المنتجات**: يمكن للمستخدمين المسجلين إضافة تقييمات للمنتجات وإدارتها.
- **إضافة إلى السلة والمفضلة**: يتيح للمستخدمين إضافة المنتجات إلى سلتهم أو قائمة المفضلة.
- **إتمام عملية الشراء**: دعم لعملية الشراء باستخدام الدفع النقدي.
- **تعديل الملف الشخصي**: يمكن للمستخدمين تحديث معلومات حساباتهم.

## تجربة الزوار

- يمكن للزوار تصفح المنتجات والأقسام والماركات المتاحة دون الحاجة لإنشاء حساب.

## الأمان

تتم عملية المصادقة باستخدام **JWT** (JSON Web Token) لضمان أمان البيانات والتحكم في الوصول.

## Note

**لتمكين رفع الصور، يجب إنشاء هيكل المجلدات التالي :**

- `storage`
  - `upload`
    - `images`
      - `brands`
      - `categories`
      - `products`
      - `users`

---

## المتطلبات

- Node.js
- MongoDB
- Mongoose
- Express

## كيفية التشغيل

1. قم بنسخ المشروع إلى جهازك باستخدام Git.
2. تأكد من تثبيت جميع المتطلبات.
3. قم بتشغيل خادم MongoDB محلي.
4. استخدم الأمر التالي لتثبيت الحزم المطلوبة:

   ```bash
   npm install
   ```

5. ابدأ الخادم باستخدام:

   ```bash
   npm run dev
   ```

## المساهمة

يسعدنا تلقي مساهماتك! إذا كنت ترغب في تحسين المشروع، يرجى فتح طلب سحب (Pull Request) أو إرسال ملاحظاتك.

---

إليك شرحًا لكل أمر من أوامر الـ `scripts` الموجودة في ملف `package.json` الخاص بمشروعك، مما يساعد على توضيح وظيفة كل منها:

```json
"scripts": {
    "dev": "nodemon config/server.js",
    "dev:db": "sudo docker compose up -d && nodemon config/server.js",
    "start:db": "sudo docker compose up -d",
    "stop:db": "sudo docker compose down",
    "prod": "APP_ENV=prod node config/server.js",
    "routers:list": "node tools/ListOfRoutes.js"
}
```

### الأوامر

1. **`dev`**:

   - **الوصف**: يبدأ الخادم في وضع التطوير باستخدام `nodemon`.
   - **وظيفة**: يستخدم `nodemon` لمراقبة التغييرات في ملفات المشروع، وعندما يتم تعديل أي ملف، يقوم بإعادة تشغيل الخادم تلقائيًا. يعمل على `server.js` الموجود في مجلد `config`.

2. **`dev:db`**:

   - **الوصف**: يبدأ قاعدة البيانات باستخدام Docker ثم يبدأ الخادم في وضع التطوير.
   - **وظيفة**: يقوم هذا الأمر بتشغيل خدمات Docker المحددة في ملف `docker-compose.yml` (بتشغيلها في الخلفية باستخدام `-d`)، ثم يبدأ الخادم باستخدام `nodemon`. يتطلب الأمر صلاحيات الجذر (sudo).

3. **`start:db`**:

   - **الوصف**: يبدأ خدمات قاعدة البيانات باستخدام Docker.
   - **وظيفة**: يقوم بتشغيل خدمات Docker الموجودة في `docker-compose.yml` في الخلفية، مما يتيح إعداد قاعدة البيانات قبل تشغيل الخادم.

4. **`stop:db`**:

   - **الوصف**: يوقف جميع خدمات Docker.
   - **وظيفة**: يقوم بإيقاف جميع الحاويات التي تم تشغيلها بواسطة Docker، مما يؤدي إلى إيقاف قاعدة البيانات والخدمات المرتبطة بها.

5. **`prod`**:

   - **الوصف**: يبدأ الخادم في بيئة الإنتاج.
   - **وظيفة**: يقوم بتعيين متغير البيئة `APP_ENV` إلى `prod` ثم يبدأ الخادم، مما يشير إلى أن التطبيق يعمل في وضع الإنتاج.

6. **`routers:list`**:
   - **الوصف**: يعرض قائمة بجميع المسارات في التطبيق.
   - **وظيفة**: يقوم بتشغيل ملف `ListOfRoutes.js` في مجلد `tools`، والذي يمكن أن يحتوي على منطق لعرض جميع المسارات المتاحة في التطبيق.

### الاستخدام

يمكنك تشغيل أي من هذه الأوامر باستخدام npm من سطر الأوامر. على سبيل المثال، لتشغيل الخادم في وضع التطوير، يمكنك كتابة:

```bash
npm run dev
```

ويمكنك استخدام أوامر `dev:db` و`start:db` و`stop:db` لإدارة قاعدة البيانات حسب الحاجة.
