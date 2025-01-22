/**
 * @description 이미지 로드에 실패했을 때 기본 프로필 이미지 설정
 *
 * @param {Event} event - 이미지 로드 실패 시 발생하는 이벤트 객체
 * @example
 * // Vue 컴포넌트에서의 사용 예시:
 * <template>
 *   <Avatar
 *     :image="author?.avatar_url"
 *     @error="handleAvatarError"
 *     shape="circle"
 *     size="large"
 *   />
 * </template>
 *
 * <script>
 * import { setDefaultAvatar } from "@/utils/imageUtils";
 *
 * export default {
 *   methods: {
 *     handleAvatarError(event) {
 *       setDefaultAvatar(event);
 *     },
 *   },
 * };
 * </script>
 */
import defaultProfileIMG from "@/assets/default-profile-image.svg";

export const setDefaultAvatar = (event) => {
  event.target.src = defaultProfileIMG;
};