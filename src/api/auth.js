import { supabase } from "./index.js";

export const authAPI = {
// GitHub 로그인
async logInWithGithub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('GitHub 로그인 실패:', error);
    throw error;
  }
},

  // Google 로그인
  async logInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      throw error;
    }
  },

  // 현재 로그인한 사용자 정보 조회
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      return user;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // 로그아웃
  async logOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  },

  // 사용자 세션 관리
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error("세션 조회 실패:", error);
      throw error;
    }
  },

  // 세션 상태 변경 감지
  onAuthStateChange(callback) {
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(callback);
      return subscription;
    } catch (error) {
      console.error("Auth 상태 변경 감지 실패:", error);
      throw error;
    }
  },
};
