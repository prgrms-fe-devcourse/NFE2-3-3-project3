<script setup>
import { supabase } from '@/config/supabase';
import { onMounted, ref } from 'vue';

const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: '/',
    },
  });
  console.log(data);
};

const getdata = ref([]);

const getTestData = async () => {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.log(profiles);
  getdata.value = profiles;
};

const insertData = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ name: '테스트2', introduce: 'otherValue' }]);
  if (data) {
    console.log(data);
  } else {
    console.log(error);
  }
  // 신규 데이터 받아오기
};

// 로그인 유저 id 저장
const user_id = ref('');
const getUserInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  user_id.value = user.id;
};

const getUserProfile = async () => {
  console.log(user_id);
  let { data: user_profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user_id.value)
    .single();
  console.log(user_profiles);
};

onMounted(() => {
  insertData();
});
</script>

<template>
  <div>{{ 'getdata[0].id' }}</div>
  <div>{{ 'getdata[0].id' }}</div>
  <div>
    <button @click="signInWithGithub()">로그인 버튼</button>
  </div>
  <div>
    <button @click="getUserInfo()">유저정보 불러오기</button>
  </div>
  <div>
    <button @click="getUserProfile()">유저 프로필 불러오기</button>
  </div>
</template>

<style lang="scss" scoped></style>
