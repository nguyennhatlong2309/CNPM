/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chat` | `/(tabs)/pickup` | `/(tabs)/profile` | `/(tabs)/reports` | `/_sitemap` | `/api/students/route` | `/chat` | `/login` | `/pickup` | `/profile` | `/reports`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
