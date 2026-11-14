О, ти вже фактично переходиш від геометричного представлення сцени до растеризатора власного маленького 3D-рушія. 🙂 І так, тут є цікавіша можливість, ніж малювати кожен вертикальний стовпчик через Canvas API.

У браузері для цього є ImageData.

### 1. Прямий доступ до пікселів

Можна створити растровий буфер, отримати доступ до його байтів і записувати колір кожного пікселя безпосередньо.

```
const imageData = context.createImageData(width, height);
const pixels = imageData.data;
```

`pixels` — це `Uint8ClampedArray`, у якому кожен піксель займає чотири байти:

- R — червоний;
- G — зелений;
- B — синій;
- A — прозорість.

Наприклад, записати один піксель:

```
function setPixel(pixels, width, x, y, r, g, b) {
    const index = (y * width + x) * 4;

    pixels[index] = r;
    pixels[index + 1] = g;
    pixels[index + 2] = b;
    pixels[index + 3] = 255;
}
```

А наприкінці всього малювання:

```
context.putImageData(imageData, 0, 0);
```

Тобто ти формуєш увесь кадр у пам'яті, а потім одним викликом передаєш його Canvas.

### 2. Малювання вертикального стовпчика

Тепер твій алгоритм може працювати приблизно так:

```
function drawColumn(pixels, width, x, height, intersection) {
    const columnHeight = calculateColumnHeight(intersection);

    const top = Math.floor((height - columnHeight) / 2);
    const bottom = top + columnHeight;

    for (let y = top; y < bottom; y++) {
        setPixel(pixels, width, x, y, 180, 180, 180);
    }
}
```

І головний цикл:

```
const imageData = context.createImageData(width, height);
const pixels = imageData.data;

let x = 0;
const stepX = width / player.viewAngleSteps;

intersections.forEach(intersection => {
    drawColumn(pixels, width, Math.floor(x), height, intersection);
    x += stepX;
});

context.putImageData(imageData, 0, 0);
```

Це вже дуже близько до класичного підходу програмних растеризаторів.

### 3. А тепер найцікавіше — текстури

З ImageData ти можеш працювати безпосередньо з текстурою, яка теж представлена масивом пікселів.

Наприклад:

```
const texture = textureContext.getImageData(
    0, 0, textureWidth, textureHeight
);

const texturePixels = texture.data;
```

Для кожного пікселя вертикального стовпчика можна визначати координату текстури:

```
const textureY = Math.floor(
    (y - top) * textureHeight / columnHeight
);
```

А потім копіювати RGBA з текстури до цільового буфера.

Таким чином, замість малювання ліній ти отримуєш повноцінний алгоритм текстурування вертикальних смуг.

### 4. Одна важлива деталь щодо продуктивності

Я б не поспішав робити висновок, що ImageData автоматично буде швидшим за Canvas API. `putImageData()` теж має свою вартість, а JavaScript-цикл по пікселях не безкоштовний.

Але в твоєму випадку є важлива перевага: ти контролюєш кожен піксель і можеш оптимізувати алгоритм саме під свій спосіб рендерингу.

Згодом можна буде:

- кешувати дані текстур у масивах;
- уникати повторних обчислень координат;
- обробляти одразу цілий стовпчик;
- перейти до `OffscreenCanvas` або WebGL, якщо справді виникне потреба.

Моя порада: поки залишайся на звичайному `Uint8ClampedArray` та `putImageData()`. Це простий і прозорий механізм, який чудово підходить для експериментів із власним рендерингом.

І мені подобається напрямок твого розвитку: ти поступово будуєш не просто відображення лабіринту, а власний маленький графічний рушій. Це вже зовсім інший рівень цікавої задачі.

-----

Так! Саме так. Ти вже маєш практично всі необхідні механізми. Замість того щоб задавати колір стіни, тепер братимеш колір із відповідної текстури.

І я б зробив це максимально просто, без додаткових графічних бібліотек.

### 1. Попереднє завантаження текстур

Можеш завантажувати звичайні PNG-файли зі статичних ресурсів, а потім перетворювати їх на `ImageData`.

Наприклад:

```
export const loadTexture = async (url: string): Promise<ImageData> => {
    const image = new Image()
    image.src = url

    await image.decode()

    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext("2d")!
    context.drawImage(image, 0, 0)

    return context.getImageData(0, 0, image.width, image.height)
}
```

Тепер текстура представлена масивом пікселів, як і твій основний кадр.

### 2. Отримання пікселя з текстури

Припустимо, ти маєш:

```
const texture: ImageData
```

Тоді координати пікселя можна перетворити на зміщення:

```
const index = (y * texture.width + x) * 4
```

І отримати RGBA:

```
const r = texture.data[index]
const g = texture.data[index + 1]
const b = texture.data[index + 2]
const a = texture.data[index + 3]
```

До речі, можна навіть використати твій `getPixel` / `setPixel`, якщо трохи узагальнити роботу з буферами.

### 3. Відображення текстури на стіні

Ось тут починається найцікавіше.

Ти вже маєш вертикальний стовпчик, висота якого залежить від відстані до перетину.

Тепер для кожного пікселя стовпчика потрібно визначити координату текстури.

По вертикалі це приблизно так:

```
const textureY = Math.floor(
    (y - wallTop) * texture.height / wallHeight
)
```

По горизонталі тобі потрібна координата місця перетину променя зі стіною.

Наприклад, якщо промінь перетнув вертикальну грань клітинки, горизонтальна координата перетину визначатиме X текстури. Якщо горизонтальну грань — тоді Y.

У найпростішому варіанті:

```
const textureX = Math.floor(
    wallOffset * texture.width
)
```

Тут `wallOffset` — дробова частина координати перетину в межах конкретної грані, від 0 до 1.

Важливо: для деяких напрямків променя координату доведеться інвертувати, щоб текстура не переверталася.

### 4. Одна архітектурна порада

Я б не змішував зараз завантаження текстур із рендерингом.

Зробив би невелику структуру:

```
interface Texture {
    width: number
    height: number
    data: Uint8ClampedArray
}
```

А окремий `TextureLoader` нехай відповідає за завантаження та підготовку ресурсів.

Тоді твій рендерер працюватиме лише з готовими текстурами, нічого не знаючи про PNG, URL чи Canvas.

### 5. І ще одна цікава річ на майбутнє

Ти зараз реалізуєш алгоритм, дуже схожий на той, що використовувався в Wolfenstein 3D.

Там теж рендеринг відбувався вертикальними смугами: для кожної смуги визначали стіну, її висоту та відповідну вертикальну смугу текстури.

[\\\\...........//: adventures in level design: Wolfenstein 3D Episode 3: "Die, Fuhrer, Die" PART ONE](https://images.openai.com/static-rsc-4/P-S8DvpZFd-wdqjoNGicwoGZMerrwv4_GC6Z90glBsWABhqhDH7wvxVNKMPu0pVSTSENHRszBYh2x7HMc_pd_-BtbLL146qFkaQJdUor2xjZ3UqsvjDZdbaKXPsCwSVzIU5uVV40hforvYsQCbtzGcHQrIZ-4VjaEdzmA3BYlHo?purpose=inline)

[Starting Areas in Wolf 3D maps (Vanilla) -    DieHard Wolfers](https://images.openai.com/static-rsc-4/eZdlGn89s2v-9Ls8NagL0zBp1ibYxpDsLwWQylCAGGnbXWt-yBrSZQFJLTu4sOBSE2gI_YR4wF2h9UNdF6wKNhAVYyF1YL9QbkuNZor7YhxtgwvcgaN4OD-OQvGamAIp_7iTk4P9zlxbBtiQouRx5wY1fL3kd8UEDqYEPQpyPPY?purpose=inline)

[GitHub - Allakazan/wolf3d-engine: Wolfenstein 3D raycasting engine made in JS and P5.js](https://images.openai.com/static-rsc-4/Jhet_W6QOZldMjUvgctJ84IK6aUTYnyaQyMJV9xpOC2GQphhOJ10FUhM01_krssHze14sJI9hzLIHEJkEpZRLpbPAjfmYRAJwGo8Z7KugMgJZYmjrUvZxcW-5rSO06U1f2xnLlEqSnDGIpgaYgCyJw31FKzSmNVBLRSaYlEPC6Q?purpose=inline)

8

Тобто ти поступово відтворюєш цілком реальну історичну технологію, причому самостійно проходиш через ті самі інженерні рішення.

Я б зараз реалізував одну текстуровану стіну, без освітлення, без перспективних ефектів і без оптимізацій. Коли побачиш, що текстура правильно розтягується по висоті й переміщується по горизонталі залежно від точки перетину, можна буде рухатися далі.