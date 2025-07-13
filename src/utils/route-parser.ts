export interface RouteMatch {
  isMatch: boolean;
  params: Record<string, string>;
}

export class RouteParser {
  static parseRoute(routePattern: string, actualPath: string): RouteMatch {
    const routeSegments = routePattern.split('/').filter(Boolean);
    const pathSegments = actualPath.split('/').filter(Boolean);

    if (routeSegments.length !== pathSegments.length) {
      return { isMatch: false, params: {} };
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const pathSegment = pathSegments[i];

      if (this.isParameterSegment(routeSegment)) {
        const paramName = this.extractParameterName(routeSegment);
        params[paramName] = pathSegment;
      } else if (routeSegment !== pathSegment) {
        return { isMatch: false, params: {} };
      }
    }

    return { isMatch: true, params };
  }

  private static isParameterSegment(segment: string): boolean {
    return segment.startsWith('{') && segment.endsWith('}');
  }

  private static extractParameterName(segment: string): string {
    return segment.slice(1, -1);
  }

  static buildRoutePattern(path: string): string {
    return path;
  }

  static normalizeRoute(path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  }
}
