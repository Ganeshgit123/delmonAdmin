import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  })
};
@Injectable({
  providedIn: 'root'
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
    .set('Access-Control-Allow-Credentials', 'true')

  requestOptions = { headers: this.headers };
  constructor(private http: HttpClient, private router: Router) { }

  s3upload(user: any) {
    return this.http
      .post<any>(`${this.s3Endpoint}/upload`, user);
  }

  excelUpload(data: any, id) {
    return this.http
      .post<any>(`${this.userEndpoint}/productImport/${id}`, data);
  }


  signIn(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/login`, user);
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

  doLogout(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/logout`,
      { params: param1 });
  }

  getContent() {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/setting`,
      { params: param1 });
  }

  updateContent(data: any, id) {
    return this.http
      .post<any>(`${this.endpoint}/setting/${id}`, data);
  }

  changePassword(data: any) {
    return this.http
      .post<any>(`${this.endpoint}/changePassword/`, data);
  }
  readNotifyChange(data, id) {
    return this.http
      .post<any>(`${this.endpoint}/notification/${id}`, data);
  }

  getRoles(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/roleType`,
      { params: param1 });
  }

  addRole(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/roleType`, user);
  }

  editRole(data: any, id) {
    return this.http
      .post<any>(`${this.endpoint}/roleType/${id}`, data);
  }

  deleteRole(id: any) {
    return this.http
      .delete<any>(`${this.endpoint}/roleType/${id}`,);
  }

  getUserAdmin(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/roles`,
      { params: param1 });
  }

  getAdminUser(): Observable<any> {
    const param1 = new HttpParams()
    var id = JSON.parse(sessionStorage.getItem("adminId"))
    return this.http.get<any>(`${this.endpoint}/adminUser/${id}`,
      { params: param1 });
  }

  addAdminUser(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/adminUser`, user);
  }


  editAdminUser(data: any, id) {
    return this.http.post<any>(`${this.endpoint}/adminUser/${id}`, data);
  }

  getBanner(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/banner`,
      { headers: headers });
  }

  addBanner(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/banner`, data,
      { headers: headers });
  }

  editBanner(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/banner/${id}`, user,
      { headers: headers });
  }

  deleteBanner(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.delete<any>(`${this.endpoint}/banner/delete/${id}`,
      { headers: headers });
  }

  getNormalUsers() {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .get<any>(`${this.endpoint}/user`,
        {
          headers: headers,
          params: new HttpParams()
            .set('userType', "USER")
        });
  }

  getMerchantUsers() {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .get<any>(`${this.endpoint}/user`,
        {
          headers: headers,
          params: new HttpParams()
            .set('userType', "MERCHANT")
        });
  }

  approveMerchant(data: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/user/update/${id}`, data,
        { headers: headers });
  }

  getEmployeeUsers() {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .get<any>(`${this.endpoint}/user`,
        {
          headers: headers,
          params: new HttpParams()
            .set('userType', "EMPLOYEE")
        });
  }

  approveEmployee(data: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/user/update/${id}`, data,
        { headers: headers });
  }

  getCategory(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/category`,
      { headers: headers });
  }

  getCategoryUser(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.userEndpoint}/category`,
      { headers: headers });
  }

  getSubCategory(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'FEEDING')
    return this.http
      .get<any>(`${this.endpoint}/subCategory`,
        {
          headers: headers,
          params: new HttpParams()
            .set('categoryId', id)
        });
  }

  addPoultryCategory(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/category`, data,
        { headers: headers });
  }

  editCategory(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/category/${id}`, user,
        { headers: headers });
  }

  deleteCategory(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .delete<any>(`${this.endpoint}/category/delete/${id}`,
        { headers: headers });
  }

  getProducts(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product`,
      { headers: headers });
  }

  getProductsWithoutParentId1(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product`,
      {
        headers: headers, params: new HttpParams()
          .set('parentId', 'ALL')
      });
  }

  getProductsWithParentOnly(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product`,
      {
        headers: headers,
        params: new HttpParams()
          .set('parentId', 0)
      });
  }

  getProductsWithParentIdFeed(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product`,
      {
        headers: headers,
        params: new HttpParams()
          .set('parentId', 0)
      });
  }

  addProduct(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/product`, data,
      { headers: headers });
  }

  editProduct(data: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/product/${id}`, data,
      { headers: headers });
  }

  deleteProd(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.delete<any>(`${this.endpoint}/product/delete/${id}`,
      { headers: headers });
  }

  deleteProdSoft(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.delete<any>(`${this.endpoint}/product/${id}`,
      { headers: headers });
  }

  getProductsDetails(type, id): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product/${id}`,
      { headers: headers });
  }

  addReletedProduct(data: any) {
    return this.http.post<any>(`${this.endpoint}/product/add`, data);
  }

  editReletedProduct(data: any) {
    return this.http.post<any>(`${this.endpoint}/product/update`, data);
  }

  getPriceListName(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/priceListName`,
      { headers: headers });
  }

  addPriceListName(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/priceListName`, data,
      { headers: headers });
  }
  editPriceListName(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/priceListName/${id}`, user,
      { headers: headers });
  }

  deletePriceListName(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.delete<any>(`${this.endpoint}/priceListName/delete/${id}`,
      { headers: headers });
  }

  addProductPriceList(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/ProductPriceList`, data,
      { headers: headers });
  }

  getProductPriceList(type, id): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http
      .get<any>(`${this.endpoint}/ProductPriceList`,
        {
          headers: headers,
          params: new HttpParams()
            .set('priceListId', id)
        });
  }

  editProductPriceList(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/ProductPriceList/${id}`, user,
      { headers: headers });
  }

  getuserListPrice(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/userType`,
      { headers: headers });
  }

  edituserListPrice(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/userType/${id}`, user,
      { headers: headers });
  }

  getReceipes(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/recipies`,
      { headers: headers });
  }

  addReceipes(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/recipies`, data,
        { headers: headers });
  }

  editReceipes(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/recipies/${id}`, user,
      { headers: headers });
  }

  deleteReceipes(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.delete<any>(`${this.endpoint}/recipies/delete/${id}`,
      { headers: headers });
  }

  addNewBasket(data: any) {
    return this.http
      .post<any>(`${this.endpoint}/product`, data);
  }

  getBaskets(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/product/basketList`,
      {
        headers: headers,
        params: new HttpParams()
          .set('isBasket', 1)
      });
  }

  editBakset(data: any, id) {
    return this.http.post<any>(`${this.endpoint}/product/${id}`, data)
  }

  getZones(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/zone`,
      { headers: headers });
  }

  addZone(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/zone`, data,
      { headers: headers });
  }

  editZone(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/zone/${id}`, user,
      { headers: headers });
  }

  getAreas(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/area`,
      {
        headers: headers,
        params: new HttpParams()
          .set('zoneId', id)
      });
  }

  addAreas(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/area`, data,
      { headers: headers });
  }

  editAreasd(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/area/${id}`, user,
      { headers: headers });
  }

  getPin(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/pin`,
      {
        headers: headers,
        params: new HttpParams()
          .set('areaId', id)
      });
  }

  addPin(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/pin`, data,
      { headers: headers });
  }

  editPin(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/pin/${id}`, user,
      { headers: headers });
  }

  createNewDriver(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.driverEndpoint}/auth/create`, data,
        { headers: headers });
  }

  editDriver(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.driverEndpoint}/auth/update/${id}`, user,
        { headers: headers });
  }

  deleteDriver(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .delete<any>(`${this.driverEndpoint}/auth/delete/${id}`,
        { headers: headers });
  }

  getDrivers(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.driverEndpoint}/auth/list`,
      { headers: headers });
  }

  addCoupon(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/coupon`, data,
      { headers: headers });
  }

  editCoupon(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/coupon/${id}`, user,
      { headers: headers });
  }

  getCoupon(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/coupon`,
      { headers: headers });
  }

  deleteCoupons(id: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .delete<any>(`${this.endpoint}/coupon/${id}`,
        { headers: headers });
  }

  getOrders(deliveryType): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/order`,
      {
        headers: headers,
        params: new HttpParams()
          .set('deliveryType', deliveryType)
      });
  }

  approveOrderSingle(id, data) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/order/${id}`, data,
        { headers: headers });
  }

  approveOrderMulti(data) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/order/multiApprove`, data,
        { headers: headers });
  }

  getDriversActive(object): Observable<any> {
    const headers = new HttpHeaders()
    // .set('type', 'POULTRY')
    return this.http.get<any>(`${this.driverEndpoint}/auth/list`,
      {
        headers: headers,
        params: new HttpParams()
          .set('active', object)
      });
  }

  getSettings(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/setting`,
      { headers: headers });
  }

  updateSetting(body, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/setting/${id}`, body,
      { headers: headers });
  }

  getSalesReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/deliveryBoy/driverReport`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
          .set('deliveryBoyId', object.deliveryBoyId)
          .set('orderStatus', object.orderStatus)
      });
  }

  getFinanceReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/deliveryBoy/driverReport`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
      });
  }

  getInternalSalesReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/order`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
          .set('deliveryType', object.deliveryType)
      });
  }

  getFeedbacks(): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/report/getReport`,
      { headers: headers });
  }

  createNormalUser(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/auth/createUser`, data,
        { headers: headers });
  }

  dashboard(type): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', type)
    return this.http.get<any>(`${this.endpoint}/dashboard`,
      { headers: headers });
  }

  updateUserType(data: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/user/update/${id}`, data,
        { headers: headers });
  }

  getOrdersWithStatus(object): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/order`,
      {
        headers: headers,
        params: new HttpParams()
          .set('deliveryType', object.deliveryType)
          .set('orderStatus', object.orderStatus)
      });
  }

  pushnotification(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/fcm`, data,
        { headers: headers });
  }

  pushSms(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/sms`, data,
        { headers: headers });
  }

  pushEMails(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http
      .post<any>(`${this.endpoint}/emailNotification`, data,
        { headers: headers });
  }

  addSpinWheel(data: any) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/SpinAndWin`, data,
      { headers: headers });
  }

  editSpinWheel(user: any, id) {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.post<any>(`${this.endpoint}/SpinAndWin/${id}`, user,
      { headers: headers });
  }

  getSpinWheel(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/SpinAndWin`,
      { params: param1 });
  }

  getSpinWheelWinner(): Observable<any> {
    const param1 = new HttpParams()
    return this.http.get<any>(`${this.endpoint}/spinAndWinList`,
      { params: param1 });
  }

  getSpinList(object): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
    return this.http.get<any>(`${this.endpoint}/order/listWithSum`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
          .set('amount', object.amount)
      });
  }

  addUserIdForSpinner(userId: any) {
    return this.http
      .post<any>(`${this.endpoint}/SpinAndWin/add`, userId);
  }

  getUserHistory(id: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('type', 'POULTRY')
      .set('userId', String(id))
    return this.http.get<any>(`${this.userEndpoint}/wallet`,
      { headers: headers });
  }

  getMostWantedProductReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/product/mostOrderProduct`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
      });
  }

  getMostWantedAddressReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/product/mostWantedAddress`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
      });
  }

  getFavourtieReport(object) {
    const headers = new HttpHeaders()
      .set('type', object.type)
    return this.http.get<any>(`${this.endpoint}/product/mostFavoritesProduct`,
      {
        headers: headers,
        params: new HttpParams()
          .set('startDate', object.startDate)
          .set('endDate', object.endDate)
      });
  }
}


