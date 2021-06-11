export function SET_PRODUCTS(state, payload) {
  state.products = payload;
}
export function SET_USERS(state, payload) {
  state.users = payload;
}
export function SET_ADMIN(state, payload) {
  state.isAuthenticated = true;
}
export function UNSET_ADMIN(state, payload) {
  state.isAuthenticated = false;
}
export function ADD_TO_CART(state) {
  state.itemOfCart += 1;
}
export function LOGIN(state, payload) {
  state.userInfo = JSON.parse(payload);
  localStorage.setItem("userInfo", payload);
}
export function AUTO_LOGIN(state) {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    state.userInfo = JSON.parse(userInfo);
  }
}
export function LOGOUT(state) {
  localStorage.clear();
  state.userInfo = null;
  state.cart = null;
}
export function setCart(state, payload) {
  state.cart = payload;
}
export function setDeliveryMethod(state, payload) {
  state.deliveryMethod = payload;
}
export function setOrder(state, payload) {
  state.order = payload;
}
export function setOrderAdmin(state, payload) {
  state.orderAdmin = payload;
}
export function setCategory(state, payload) {
  state.category = payload;
}
export function setCompany(state, payload) {
  state.company = payload;
}