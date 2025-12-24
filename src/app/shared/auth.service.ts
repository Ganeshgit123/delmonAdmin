import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ApiResponse } from './models/api-response';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = environment.baseUrl;
  driverEndpoint = environment.driverUrl;
  s3Endpoint = environment.s3Url;
  userEndpoint = environment.userUrl;
  accToken = sessionStorage.getItem('access_token');

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true');

  requestOptions = { headers: this.headers };
  constructor(
    private http: HttpClient,
  ) {}

  s3upload(user: unknown) {
    return this.http.post<ApiResponse<unknown>>(`${this.s3Endpoint}/upload`, user);
  }

  excelUpload(data: unknown, id: number | string) {
    return this.http.post<ApiResponse<unknown>>(`${this.userEndpoint}/productImport/${id}`, data);
  }

  signIn(user: unknown) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/login`, user);
  }
  getToken() {
    return sessionStorage.getItem('access_token');
  }

  getLanguage() {
    return localStorage.getItem('lang');
  }

  getWebFlow() {
    return localStorage.getItem('flow');
  }

  doLogout(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/logout`, { params: param1 });
  }

  getContent(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/setting`, { params: param1 });
  }

  updateContent(data: unknown, id: number | string) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/setting/${id}`, data);
  }

  changePassword(data: unknown) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/changePassword/`, data);
  }
  readNotifyChange(data: unknown, id: number | string) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/notification/${id}`, data);
  }

  getRoles(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/roleType`, { params: param1 });
  }

  addRole(user: unknown) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/roleType`, user);
  }

  editRole(data: unknown, id: number | string) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/roleType/${id}`, data);
  }

  deleteRole(id: number | string) {
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/roleType/${id}`);
  }

  getUserAdmin(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/roles`, { params: param1 });
  }

  getAdminUser(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    const adminIdRaw = sessionStorage.getItem('adminId');
    const id = adminIdRaw ? JSON.parse(adminIdRaw) : '0';
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/adminUser/${id}`, { params: param1 });
  }

  addAdminUser(user: unknown) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/adminUser`, user);
  }

  editAdminUser(data: unknown, id: number | string) {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/adminUser/${id}`, data);
  }

  getBanner(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/banner`, { headers: headers });
  }

  addBanner(data: unknown) {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/banner`, data, { headers: headers });
  }

  editBanner(user: unknown, id: number | string) {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/banner/${id}`, user, { headers: headers });
  }

  deleteBanner(id: number | string) {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/banner/delete/${id}`, { headers: headers });
  }

  getNormalUsers(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/user`, {
      headers: headers,
      params: new HttpParams().set('userType', 'USER'),
    });
  }

  getMerchantUsers(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/user`, {
      headers: headers,
      params: new HttpParams().set('userType', 'MERCHANT'),
    });
  }

  approveMerchant(data: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/user/update/${id}`, data, { headers: headers });
  }

  getEmployeeUsers(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/user`, {
      headers: headers,
      params: new HttpParams().set('userType', 'EMPLOYEE'),
    });
  }

  approveEmployee(data: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/user/update/${id}`, data, { headers: headers });
  }

  getCategory(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/category`, { headers: headers });
  }

  getCategoryUser(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.userEndpoint}/category`, { headers: headers });
  }

  getSubCategory(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'FEEDING');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/subCategory`, {
      headers: headers,
      params: new HttpParams().set('categoryId', id),
    });
  }

  addPoultryCategory(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/category`, data, { headers: headers });
  }

  editCategory(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/category/${id}`, user, { headers: headers });
  }

  deleteCategory(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/category/delete/${id}`, { headers: headers });
  }

  getProducts(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product`, { headers: headers });
  }

  getProductsWithoutParentId1(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product`, {
      headers: headers,
      params: new HttpParams().set('parentId', 'ALL'),
    });
  }

  getProductsWithParentOnly(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product`, {
      headers: headers,
      params: new HttpParams().set('parentId', 0),
    });
  }

  getProductsWithParentIdFeed(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product`, {
      headers: headers,
      params: new HttpParams().set('parentId', 0),
    });
  }

  addProduct(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product`, data, { headers: headers });
  }

  editProduct(data: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product/${id}`, data, { headers: headers });
  }

  deleteProd(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/product/delete/${id}`, { headers: headers });
  }

  deleteProdSoft(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/product/${id}`, { headers: headers });
  }

  getProductsDetails(type: string, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product/${id}`, { headers: headers });
  }

  addReletedProduct(data: unknown): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product/add`, data);
  }

  editReletedProduct(data: unknown): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product/update`, data);
  }

  getPriceListName(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/priceListName`, { headers: headers });
  }

  addPriceListName(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/priceListName`, data, { headers: headers });
  }
  editPriceListName(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/priceListName/${id}`, user, { headers: headers });
  }

  deletePriceListName(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/priceListName/delete/${id}`, { headers: headers });
  }

  addProductPriceList(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/ProductPriceList`, data, { headers: headers });
  }

  getProductPriceList(type: string, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/ProductPriceList`, {
      headers: headers,
      params: new HttpParams().set('priceListId', id),
    });
  }

  editProductPriceList(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/ProductPriceList/${id}`, user, { headers: headers });
  }

  getuserListPrice(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/userType`, { headers: headers });
  }

  edituserListPrice(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/userType/${id}`, user, { headers: headers });
  }

  getReceipes(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/recipies`, { headers: headers });
  }

  addReceipes(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/recipies`, data, { headers: headers });
  }

  editReceipes(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/recipies/${id}`, user, { headers: headers });
  }

  deleteReceipes(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/recipies/delete/${id}`, { headers: headers });
  }

  addNewBasket(data: unknown): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product`, data);
  }

  getBaskets(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product/basketList`, {
      headers: headers,
      params: new HttpParams().set('isBasket', 1),
    });
  }

  editBakset(data: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/product/${id}`, data);
  }

  getZones(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/zone`, { headers: headers });
  }

  addZone(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/zone`, data, { headers: headers });
  }

  editZone(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/zone/${id}`, user, { headers: headers });
  }

  getAreas(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/area`, {
      headers: headers,
      params: new HttpParams().set('zoneId', id),
    });
  }

  addAreas(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/area`, data, { headers: headers });
  }

  editAreasd(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/area/${id}`, user, { headers: headers });
  }

  getPin(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/pin`, {
      headers: headers,
      params: new HttpParams().set('areaId', id),
    });
  }

  addPin(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/pin`, data, { headers: headers });
  }

  editPin(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/pin/${id}`, user, { headers: headers });
  }

  createNewDriver(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.driverEndpoint}/auth/create`, data, { headers: headers });
  }

  editDriver(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.driverEndpoint}/auth/update/${id}`, user, { headers: headers });
  }

  deleteDriver(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.driverEndpoint}/auth/delete/${id}`, { headers: headers });
  }

  getDrivers(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.driverEndpoint}/auth/list`, { headers: headers });
  }

  addCoupon(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/coupon`, data, { headers: headers });
  }

  editCoupon(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/coupon/${id}`, user, { headers: headers });
  }

  getCoupon(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/coupon`, { headers: headers });
  }

  deleteCoupons(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.delete<ApiResponse<unknown>>(`${this.endpoint}/coupon/${id}`, { headers: headers });
  }

  getOrders(deliveryType: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/order`, {
      headers: headers,
      params: new HttpParams().set('deliveryType', deliveryType),
    });
  }

  approveOrderSingle(id: number | string, data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/order/${id}`, data, { headers: headers });
  }

  approveOrderMulti(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/order/multiApprove`, data, { headers: headers });
  }

  getDriversActive(object: string | number): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders();
    // .set('type', 'POULTRY')
    return this.http.get<ApiResponse<unknown>>(`${this.driverEndpoint}/auth/list`, {
      headers: headers,
      params: new HttpParams().set('active', object),
    });
  }

  getSettings(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/setting`, { headers: headers });
  }

  updateSetting(body: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/setting/${id}`, body, { headers: headers });
  }

  getSalesReport(object: {
    type: string;
    startDate: string;
    endDate: string;
    deliveryBoyId: string | number;
    orderStatus: string;
  }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/deliveryBoy/driverReport`, {
      headers: headers,
      params: new HttpParams()
        .set('startDate', object.startDate)
        .set('endDate', object.endDate)
        .set('deliveryBoyId', object.deliveryBoyId)
        .set('orderStatus', object.orderStatus),
    });
  }

  getFinanceReport(object: { type: string; startDate: string; endDate: string }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/deliveryBoy/driverReport`, {
      headers: headers,
      params: new HttpParams().set('startDate', object.startDate).set('endDate', object.endDate),
    });
  }

  getInternalSalesReport(object: {
    type: string;
    startDate: string;
    endDate: string;
    deliveryType: string | number;
    orderStatus: string | number;
  }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/order`, {
      headers: headers,
      params: new HttpParams()
        .set('startDate', object.startDate)
        .set('endDate', object.endDate)
        .set('deliveryType', object.deliveryType)
        .set('orderStatus', object.orderStatus),
    });
  }

  getFeedbacks(): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/report/getReport`, { headers: headers });
  }

  createNormalUser(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/auth/createUser`, data, { headers: headers });
  }

  dashboard(type: string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/dashboard`, { headers: headers });
  }

  updateUserType(data: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/user/update/${id}`, data, { headers: headers });
  }

  getOrdersWithStatus(object: { type: string; deliveryType: string | number; orderStatus: string | number }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/order`, {
      headers: headers,
      params: new HttpParams().set('deliveryType', object.deliveryType).set('orderStatus', object.orderStatus),
    });
  }

  pushnotification(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/fcm`, data, { headers: headers });
  }

  pushSms(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/sms`, data, { headers: headers });
  }

  pushEMails(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/emailNotification`, data, { headers: headers });
  }

  addSpinWheel(data: unknown): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/SpinAndWin`, data, { headers: headers });
  }

  editSpinWheel(user: unknown, id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/SpinAndWin/${id}`, user, { headers: headers });
  }

  getSpinWheel(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/SpinAndWin`, { params: param1 });
  }

  getSpinWheelWinner(): Observable<ApiResponse<unknown>> {
    const param1 = new HttpParams();
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/spinAndWinList`, { params: param1 });
  }

  getSpinList(object: { startDate: string; endDate: string; amount: string | number }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY');
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/order/listWithSum`, {
      headers: headers,
      params: new HttpParams()
        .set('startDate', object.startDate)
        .set('endDate', object.endDate)
        .set('amount', object.amount),
    });
  }

  addUserIdForSpinner(userId: unknown): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.endpoint}/SpinAndWin/add`, userId);
  }

  getUserHistory(id: number | string): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', 'POULTRY').set('userId', String(id));
    return this.http.get<ApiResponse<unknown>>(`${this.userEndpoint}/wallet`, { headers: headers });
  }

  getMostWantedProductReport(object: { type: string; startDate: string; endDate: string }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product/mostOrderProduct`, {
      headers: headers,
      params: new HttpParams().set('startDate', object.startDate).set('endDate', object.endDate),
    });
  }

  getMostWantedAddressReport(object: { type: string; startDate: string; endDate: string }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product/mostWantedAddress`, {
      headers: headers,
      params: new HttpParams().set('startDate', object.startDate).set('endDate', object.endDate),
    });
  }

  getFavourtieReport(object: { type: string; startDate: string; endDate: string }): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders().set('type', object.type);
    return this.http.get<ApiResponse<unknown>>(`${this.endpoint}/product/mostFavoritesProduct`, {
      headers: headers,
      params: new HttpParams().set('startDate', object.startDate).set('endDate', object.endDate),
    });
  }
}
