import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // req.headers.set('Access-Control-Allow-Credentials', 'true');
  return next(req);
};
