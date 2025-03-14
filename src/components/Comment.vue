<template>
  <div>
    <div class="comment-list">
      <div v-for="comment in filteredComments" :key="comment.id" class="comment-item">
        <div>
          <div class="comment-header">
            <span class="comment-info">{{ comment.nickname }} ({{ maskIp(comment.ip) }})</span>
            <span class="comment-date">
              {{ formatDate(comment.date) }}
              <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="togglePasswordInput(comment.id)" />
            </span>
          </div>
          <div class="comment-content-wrapper">
            <div class="comment-content comment-clickable" @click="toggleReplyInput(comment.id)">
              {{ comment.content }}
            </div>
            <div v-if="activePasswordInput === comment.id" class="password-input-group">
              <InputText v-model="comment.password" class="password-input" type="password" placeholder="비밀번호 입력" />
              <Button label="삭제" icon="pi" class="p-button-danger" @click="deleteComment(comment.id, comment.password)" />
            </div>
          </div>

          <!-- 대댓글 작성 폼 -->
          <div v-if="activeReplyCommentId === comment.id" class="reply-form">
            <div class="input-group-horizontal">
              <!-- 닉네임과 비밀번호를 가로로 나란히 배치 -->
              <InputText v-model="replyNickname" placeholder="닉네임"  />
              <Password v-model="replyPassword" :feedback="false" toggleMask fluid placeholder="비밀번호"/>
            </div>

            <!-- 대댓글 내용 입력 -->
            <div class="input-field">
              <Textarea v-model="replyContent" rows="3" cols="30" autoResize placeholder="댓글 내용을 입력하세요" />
            </div>

            <!-- 대등록 버튼 -->
            <Button label="대댓글 등록" icon="pi pi-check" class="p-button-success" @click="submitReply(comment.id)" />
          </div>

          <!-- 대댓글 표시 -->
          <div class="replies" v-if="comment.replies && comment.replies.length">
            <div v-for="reply in comment.replies" :key="reply.id" class="comment-item">
              <div class="comment-header">
                <span class="comment-info">{{ reply.nickname }} ({{ maskIp(reply.ip) }})</span>
                <span class="comment-date">
                  {{ formatDate(reply.date) }}
                  <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="togglePasswordInput(reply.id)" />
                </span>
              </div>
              <div class="comment-content-wrapper">
                <div class="comment-content">{{ reply.content }}</div>
                <div v-if="activePasswordInput === reply.id" class="password-input-group">
                  <InputText v-model="reply.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                  <Button label="삭제" icon="pi" class="p-button-danger" @click="deleteComment(reply.id, reply.password)" />
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />

    <!-- 댓글 작성 폼 -->
    <div class="comment-form">
      <div class="input-group-horizontal">
        <!-- 닉네임과 비밀번호를 가로로 나란히 배치 -->
        <InputText v-model="nickname" placeholder="닉네임"/>
        <Password v-model="password" :feedback="false" toggleMask fluid placeholder="비밀번호"/>
      </div>

      <!-- 댓글 내용 입력 -->
      <div class="input-field">
        <Textarea v-model="content" rows="3" cols="30" autoResize placeholder="댓글 내용을 입력하세요" />
      </div>

      <!-- 등록 버튼 -->
      <Button label="등록" icon="pi pi-check" class="p-button-success" @click="submitComment" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Password from 'primevue/password';

export default {
  components: {
    Button,
    InputText,
    Textarea,
    Password,
  },
  props: ['id'],
  data() {
    return {
      nickname: '',
      password: '',
      content: '',
      replyNickname: '', 
      replyPassword: '', 
      replyContent: '',  
      activePasswordInput: null,
      activeReplyCommentId: null,
      comments: [],
    };
  },
  computed: {
    apiUrl() {
      return `https://backend.santomato.com/api/comments/mountain/${this.id}/`;
    },

    filteredComments() {
      return this.comments.map(comment => {
        // 1. 댓글이 삭제된 상태이고 대댓글이 없으면 해당 댓글을 제외
        if (comment.deleted && comment.replies.length === 0) {
          return null;
        }

        // 2. 댓글이 삭제된 상태이고 대댓글이 있는 경우: "삭제된 댓글입니다."로 표시
        if (comment.deleted && comment.replies.length > 0) {
          const remainingReplies = comment.replies.filter(reply => !reply.deleted);
          
          // 대댓글이 모두 삭제되었으면 부모 댓글도 제외
          if (remainingReplies.length === 0) {
            return null;
          }

          return {
            ...comment,
            content: "삭제된 댓글입니다.",
            replies: remainingReplies // 삭제되지 않은 대댓글만 표시
          };
        }

        // 3. 댓글이 삭제되지 않은 경우: 삭제되지 않은 대댓글만 포함하여 반환
        return {
          ...comment,
          replies: comment.replies.filter(reply => !reply.deleted)
        };
      }).filter(comment => comment !== null); // null 댓글을 제외하고 반환
    }
  },

  methods: {
    // fetchIpAddress() 백엔드에서 처리하게 변경 
    async fetchIpAddress() {
      try {
        const response = await axios.get(`https://api.ipify.org?format=json`);
        return response.data.ip;
      } catch (error) {
        console.warn('IPv4 API failed, trying IPv6:', error);
        try {
          const response = await axios.get(`https://api64.ipify.org?format=json`);
          return response.data.ip;
        } catch (error) {
          console.error('Failed to fetch IP address:', error);
          return 'unknown';
        }
      }
    },
    
    maskIp(ip) {
        if (!ip) {
            return 'IP 미확인'; // IP가 없을 때 대체 텍스트를 반환
        }
        // 예: '192.168.0.1' -> '192.168'
        return ip.replace(/^(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}$/, "$1");
    },

    formatDate(dateString) {
        // 날짜 문자열을 Date 객체로 변환
        const date = new Date(dateString);
        // 포맷팅
        return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
        }).replace(',', ''); // 예: 2024-09-08 15:30:45
    },
  
    async fetchComments() {
        try {
            const response = await axios.get(this.apiUrl);
            
            this.comments = response.data.map(comment => ({
                ...comment,
                replyNickname: '', 
                replyPassword: '',  
                replyContent: '',   
                password: '',
                replies: (comment.replies || []).map(reply => ({
                    ...reply,
                    password: '',
                }))
            }));
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    },

    togglePasswordInput(id) {
      this.activePasswordInput = this.activePasswordInput === id ? null : id;
    },

    toggleReplyInput(commentId) {
      if (this.activeReplyCommentId === commentId) {
        this.activeReplyCommentId = null;
      } else {
        this.activeReplyCommentId = commentId;
      }
      this.replyNickname = '';
      this.replyPassword = '';
      this.replyContent = '';
    },
    
    async deleteComment(commentId, password) {
      if (!password) {
          alert('비밀번호를 입력해 주세요.');
          return;
      }
      try {
          const response = await axios.delete(`https://backend.santomato.com/api/comments/${commentId}/`, {
              data: { password: password }
          });
          this.fetchComments(); // 댓글 및 대댓글 목록 새로 고침
          this.activePasswordInput = null;
          this.activeReplyCommentId=  null;
          alert(`${response.data.message}`);
      } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
              alert(`삭제 실패: ${error.response.data.message}`);
          } else {
              console.error('Failed to delete comment:', error);
              alert('삭제 중 오류가 발생했습니다.');
          }
      }
    },
      
      async submitReply(commentId) {
      if (!this.replyNickname || !this.replyPassword || !this.replyContent) {
          alert('모든 필드를 입력해 주세요.');
          return;
      }
      if (this.replyPassword.length < 4) {
          alert('비밀번호를 4자 이상으로 입력해주세요.');
          return;
      }
      try {
          await axios.post(this.apiUrl, {
              nickname: this.replyNickname,
              password: this.replyPassword,
              content: this.replyContent,
              date: new Date().toLocaleString('ko-KR'),
              parent_comment: commentId  // 대댓글임을 나타내는 parent_comment ID 추가
          });
          this.fetchComments();
          this.replyNickname = '';
          this.replyPassword = '';
          this.replyContent = '';
          this.activeReplyCommentId = null;
          this.activePasswordInput = null;
          } catch (error) {
          console.error('Failed to submit reply:', error);
      }
    },

    async submitComment() {
        if (!this.nickname || !this.password || !this.content) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }
        if (this.password.length < 4) {
            alert('비밀번호를 4자 이상으로 입력해주세요.');
            return;
        }
        try {
            await axios.post(this.apiUrl, {
            nickname: this.nickname,
            password: this.password,
            content: this.content,
            date: new Date().toLocaleString('ko-KR'),
            parent_comment: null
            });
            this.fetchComments(); // 댓글을 새로고침
            this.nickname = '';
            this.password = '';
            this.content = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    },
  },
    
  created() {
      this.fetchComments();
  }
}
</script>


<style scoped>
.comment-form,
.reply-form {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.comment-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0px;
}

.comment-clickable {
  cursor: pointer;
}

.input-field {
  margin-top: 10px;
  width: 100%;
}

.input-field textarea {
  width: 100%;
  max-width: 100%;
}

.replies .comment-item {
  background-color: #f5f5f5;
  padding: 10px;
  margin-top: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-date {
  margin-left: auto;
}

.password-input-group .password-input,
.password-input-group .p-button-danger {
  height: 30px; 
  padding: 0 5px; 
  font-size: 0.85rem; 
}

.comment-form .p-button-success,
.reply-form .p-button-success {
  display: block;
  margin-left: auto;
  margin-top: 5px;
}

.comment-content-wrapper {
  position: relative;
}

.password-input-group {
  position: absolute; /* 절대 위치 설정 */
  top: 5%; /* X 버튼 바로 아래에 나타나도록 설정 */
  right: 0; /* 오른쪽 정렬 */
  z-index: 10; /* 다른 요소 위로 표시 */
  background: white; /* 배경색 추가 (컨텐츠를 가리기 위해) */
  padding: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
  display: flex;
  align-items: center;
  gap: 3px; 
}

.password-input-group .p-button-danger {
  height: 30px; 
  padding: 0 10px; 
  font-size: 0.85rem; 
}

.comment-content {
  position: relative; 
  z-index: 1; 
  white-space: pre-wrap; /* 줄바꿈 허용 */
  word-break: break-word; /* 긴 단어 줄바꿈 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
}

.input-group-horizontal {
  display: flex; 
  gap: 10px; 
}

/* Mobile responsiveness */
@media (max-width: 767px) {
  .p-button .p-button-label {
    font-size: 0.8rem; 
  }

  .password-input {
    width: 70%; 
  }

  .comment-form,
  .reply-form {
    max-width: 700px;
  }

  .comment-info {
    display: flex;
    align-items: center; 
    font-size: 0.9rem; 
  }

  .comment-date {
    margin-left: 0;
    margin-top: 5px;
    font-size: 0.85rem;
  }

  .comment-item {
    padding: 8px 0;
  }

  .comment-content {
    font-size: 0.9rem;
  }

  .input-group-horizontal {
    gap: 5px; 
  }

  .p-inputtext, 
  .p-password, .p-password-input { 
    width: 50% 
  }
}

@media (max-width: 480px) {
  .comment-form,
  .reply-form {
    max-width: 400px;
    height: auto;
  }

  .password-input {
    width: 70%; 
  }

  .comment-info,
  .comment-date {
    font-size: 0.8rem;
  }

  .comment-content {
    font-size: 0.85rem;
  }

  .p-button {
    font-size: 0.8rem;
  }

  .p-button-text {
    font-size: 0.7rem;
  }

}
</style>