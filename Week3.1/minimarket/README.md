````markdown
# 🛒 MiniMarket (React + Vite + Tailwind)

Mini e-commerce de un **minimarket** con **lista de productos**, **carrito**, **búsqueda/filtros**, **modo oscuro total black** y **checkout simulado** con 3 métodos de pago.

---

## ✨ ¿Qué incluye?
- **Catálogo dinámico** desde `src/data/data.json`
- **Carrito** (sumar/restar, eliminar, vaciar, total)
- **Búsqueda** + **filtro por categoría**
- **Dark mode “true black”** con toggle
- **Checkout**:
  - **Tarjeta** (Luhn, máscara de número/fecha, CVV 3/4)
  - **Yape/Plin (QR)** con `react-qr-code`
  - **Efectivo** (calcula vuelto)
- **“Recordar mis datos”** (localStorage) con opción para borrar

---

## 🧰 Stack
- Vite + React + TypeScript  
- Tailwind CSS (darkMode: `class`)  
- `react-qr-code` para QR

---

## 🚀 Cómo correr
```bash
npm i
npm run dev
# build y preview
npm run build
npm run preview
````

> Requiere Node 18+.

---

## 🗂️ Estructura breve

```
src/
  components/ (Cart, Checkout, Header, ProductCard)
    payments/ (CardForm, CashForm, WalletQR)
  data/data.json
  hooks/ (useCart, useDarkMode)
  styles/index.css
  utils/ (format, payment, storage)
  App.tsx, main.tsx
```

---

## 🧪 Datos de prueba

* Tarjeta: `4111 1111 1111 1111`, fecha `12/30`, CVV `123`.

---

## 🔼 Deploy rápido en Vercel

1. Subir a GitHub (Codespaces: `git add . && git commit -m "init" && git push`).
2. En **vercel.com** → **New Project** → importar repo.
3. Confirmar:

   * Build: `npm run build`
   * Output: `dist`
4. **Deploy**. Cada push a `main` redeploya.

---

## 📄 Licencia

Para uso educativo/demos. Ajusta libremente.

```
```
