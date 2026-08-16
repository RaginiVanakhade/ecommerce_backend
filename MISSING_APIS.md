# Added APIs

Base URL: `http://localhost:5000` (or your deployed backend URL)

All protected endpoints require:
`Authorization: Bearer <JWT_TOKEN>`

## Wishlist

- `GET /wishlists` — Get my wishlist
- `POST /wishlists/add` — Add product
  ```json
  { "productId": "PRODUCT_ID" }
  ```
- `DELETE /wishlists/remove/:productId` — Remove product
- `DELETE /wishlists/clear` — Clear wishlist

## Profile

- `GET /users/me/profile` — Get logged-in user's profile
- `PUT /users/me/profile` — Update profile
  ```json
  {
    "name": "Rohan",
    "email": "rohan@example.com",
    "mobile": "9876543210"
  }
  ```

## Change Password

- `PATCH /users/me/change-password`
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword",
    "confirmPassword": "newPassword"
  }
  ```

## Admin / Manager

- `DELETE /categories/:id` — Delete category. It is blocked if products are still linked to the category.
- `DELETE /products/deleteProduct/:id` — Delete product and its Cloudinary image.
- `DELETE /users/:id` — Delete user (ADMIN only). Cart and wishlist are also removed.

## Existing product update note

`product.controller.js` now imports the Cloudinary config so replacing a product image during update works correctly.
