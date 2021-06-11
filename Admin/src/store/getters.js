export function products(state){  
     return state.products
}
export function users(state){  
     return state.users
}
export function getUserInfo(state){
     return state.userInfo
}
export function isAuthenticated(state){
     return !!state.isAuthenticated
}
export function itemOfCart(state){
     return state.cart
}
export function deliveryMethod(state){
     return state.deliveryMethod
}
export function getOrder(state){
     return state.order
}
export function getOrderAdmin(state){
     return state.orderAdmin
}
export function getCategory(state){
     return state.category
}
export function getCompany(state){
     return state.company
}