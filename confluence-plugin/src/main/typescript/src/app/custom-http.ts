import {Http, Response, RequestOptionsArgs, Request, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ParamsService} from './params.service';

export class CustomHttp {
  constructor(private http: Http, private paramsService: ParamsService) {
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.request(url, options);
  }

  /**
   * Performs a request with `get` http method.
   */
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(url, this.parseOptions(options));
  }

  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.post(url, body, this.parseOptions(options));
  }

  /**
   * Performs a request with `put` http method.
   */
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.put(url, body, this.parseOptions(options));
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(url, this.parseOptions(options));
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.patch(url, body, this.parseOptions(options));
  }

  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.head(url, this.parseOptions(options));
  }

  /**
   * Performs a request with `options` http method.
   */
  options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.options(url, this.parseOptions(options));
  }

  private parseOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      let headers = new Headers();
      options = new RequestOptions({
        headers: headers
      });
    } else if (!options.headers) {
      options.headers = new Headers();
    }

    if (this.paramsService.getParam("macroOwner")) {
      options.headers.append("X-Macro-Owner", this.paramsService.getParam("macroOwner"));
    }

    if (!this.paramsService.isInConfluence()) {
      options.headers.append("Authorization", "Basic YWRtaW46YWRtaW4=");
    }

    return options;
  }

}
