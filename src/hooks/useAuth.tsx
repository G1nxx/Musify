// // src/hooks/useAuth.ts
// import { useState, useEffect, useCallback } from 'react';
// import { authService } from '@/services/auth'; // Ваш сервис аутентификации
// import { User } from '@/helpers/types'; // Тип пользователя
// import { storage } from '@/utils/storage'; // Утилита для работы с хранилищем
// import { usePlayer } from './usePlayer';

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { resetPlayer } = usePlayer();

//   // Проверяем аутентификацию при монтировании
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setIsLoading(true);
//         const token = await storage.getToken();

//         if (token) {
//           const userData = await authService.getCurrentUser();
//           setUser(userData);
//         }
//       } catch (err) {
//         await storage.clearToken();
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   // Регистрация нового пользователя
//   const register = useCallback(async (credentials: {
//     email: string;
//     password: string;
//     username: string;
//   }) => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const { user, token } = await authService.register(credentials);
//       await storage.setToken(token);
//       setUser(user);

//       return user;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Registration failed');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Вход пользователя
//   const login = useCallback(async (credentials: {
//     email: string;
//     password: string;
//   }) => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const { user, token } = await authService.login(credentials);
//       await storage.setToken(token);
//       setUser(user);

//       return user;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Выход пользователя
//   const logout = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       await authService.logout();
//       await storage.clearToken();
//       setUser(null);
//       resetPlayer();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Logout failed');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [resetPlayer]);

//   // Обновление профиля пользователя
//   const updateProfile = useCallback(async (updates: Partial<User>) => {
//     try {
//       setIsLoading(true);
//       const updatedUser = await authService.updateProfile(updates);
//       setUser(updatedUser);
//       return updatedUser;
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Update failed');
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return {
//     user,
//     isLoading,
//     error,
//     isAuthenticated: !!user,
//     register,
//     login,
//     logout,
//     updateProfile,
//   };
// };

export const userId = '3'
