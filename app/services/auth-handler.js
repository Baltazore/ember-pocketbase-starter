import { inject as service } from '@ember/service';

export default class AuthHandler {
  @service session;

  request({ request }, next) {
    const headers = new Headers(request.headers);
    headers.append(
      'Authorization',
      `Bearer ${this.session.data.authenticated.token}`,
    );

    return next(Object.assign({}, request, { headers }));
  }
}
