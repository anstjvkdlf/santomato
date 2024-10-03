<template>
  <div>
    <div class="comment-list">
      <div v-for="comment in filteredComments" :key="comment.id" class="comment-item">
          <!-- 댓글이 삭제되었고 대댓글이 있을 경우 "삭제된 댓글입니다" 표시 -->
          <div>
            <div class="comment-header">
                <span class="comment-info">{{ comment.nickname }} ({{ maskIp(comment.ip) }})</span>
                <span class="comment-date">
                    {{ formatDate(comment.date) }}
                    <button class="delete-button" @click="togglePasswordInput(comment.id)">x</button>
                </span>
            </div>
            <div class="comment-content comment-clickable" @click="toggleReplyInput(comment.id)">
                {{ comment.content }}
            </div>
            <div v-if="activePasswordInput === comment.id" class="password-input-group">
                <input v-model="comment.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                <button class="submit-delete-button" @click="deleteComment(comment.id, comment.password)">삭제</button>
            </div>
            
            <!-- 댓글에 대한 대댓글 작성 폼 -->
            <div v-if="activeReplyCommentId === comment.id" class="reply-form">
              <div class="input-group">
                  <input v-model="replyNickname" class="nickname-input" placeholder="닉네임" />
                  <input v-model="replyPassword" class="password-input" type="password" placeholder="비밀번호" />
              </div>
              <textarea v-model="replyContent" class="reply-input" placeholder="대댓글 내용"></textarea>
              <button class="reply-submit-button" @click="submitReply(comment.id)">대댓글 등록</button>
            </div>

            <!-- 대댓글 표시 -->
            <div class="replies" v-if="comment.replies && comment.replies.length">
                <div v-for="reply in comment.replies" :key="reply.id" class="comment-item">
                    <div class="comment-header">
                        <span class="comment-info">{{ reply.nickname }} ({{ maskIp(reply.ip) }})</span>
                        <span class="comment-date">
                            {{ formatDate(reply.date) }}
                            <button class="delete-button" @click="togglePasswordInput(reply.id)">x</button>
                        </span>
                    </div>
                    <div class="comment-content">{{ reply.content }}</div>
                    <div v-if="activePasswordInput === reply.id" class="password-input-group">
                        <input v-model="reply.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                        <button class="submit-delete-button" @click="deleteComment(reply.id, reply.password)">삭제</button>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
    <br>

    <!-- 댓글 작성 폼 -->
    <div class="comment-form">
        <div class="input-group">
            <input v-model="nickname" class="nickname-input" placeholder="닉네임" />
            <input v-model="password" class="password-input" type="password" placeholder="비밀번호" />
        </div>
        <textarea v-model="content" class="comment-input" placeholder="댓글 내용"></textarea>
        <button class="submit-button" @click="submitComment">등록</button>
    </div>

  </div>
</template>


<script>
import axios from 'axios';

export default {
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
      comments: [
        {
            "id": 26,
            "nickname": "안녕",
            "password": "1234",
            "content": "안녕",
            "date": "2024-09-08T14:23:37.063895Z",
            "ip": "127.0.0.1",
            "parent_comment": null,
            "deleted": true,
            "replies": [
                {
                    "id": 33,
                    "nickname": "123",
                    "password": "1234",
                    "content": "1234",
                    "date": "2024-09-24T15:37:20.535064Z",
                    "ip": "1.1.1.1",
                    "parent_comment": 26,
                    "deleted": false,
                    "replies": []
                }
            ]
        },
        {
            "id": 27,
            "nickname": "야호",
            "password": "1234",
            "content": "야호",
            "date": "2024-09-08T14:25:10.697420Z",
            "ip": "127.0.0.1",
            "parent_comment": null,
            "deleted": false,
            "replies": [
                {
                    "id": 36,
                    "nickname": "지현",
                    "password": "1234",
                    "content": "지현",
                    "date": "2024-09-24T15:50:24.942595Z",
                    "ip": "127.0.0.1",
                    "parent_comment": 27,
                    "deleted": false,
                    "replies": []
                }
            ]
        },
        {
            "id": 28,
            "nickname": "지현",
            "password": "1234",
            "content": "지현",
            "date": "2024-09-08T14:25:10.697420Z",
            "ip": "127.0.0.1",
            "parent_comment": null,
            "deleted": false,
            "replies": [
                
            ]
        }
    ],
    };
  },
  computed: {
    apiUrl() {
        return `http://3.39.161.55:8000/api/comments/mountain/${this.id}/`;
    },
    filteredComments() {
      return this.comments.map(comment => {
        // 대댓글이 없는 댓글은 deleted가 true일 때 표시하지 않음
        if (comment.deleted && comment.replies.length === 0) {
          return null;
        }

        // 댓글이 deleted 상태이고, 대댓글이 있으면 "삭제된 댓글입니다"를 표시
        if (comment.deleted && comment.replies.length > 0) {
          return {
            ...comment,
            content: "삭제된 댓글입니다.",
            replies: comment.replies.filter(reply => !reply.deleted) // 대댓글 필터링: deleted가 false인 것만 남김
          };
        }

        return {
          ...comment,
          replies: comment.replies.filter(reply => !reply.deleted) // 대댓글 필터링: deleted가 false인 것만 남김
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
                showPasswordInput: false, 
                showReplyInput: false,
                replyNickname: '', 
                replyPassword: '',  
                replyContent: '',   
                password: '',
                replies: (comment.replies || []).map(reply => ({
                    ...reply,
                    showPasswordInput: false, 
                    password: '',
                }))
            }));
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    },

    togglePasswordInput(id) {
      // 기존 활성화된 비밀번호 입력창을 닫고 새로운 창을 활성화
      this.activePasswordInput = this.activePasswordInput === id ? null : id;
    },

    toggleReplyInput(commentId) {
        this.activeReplyCommentId = this.activeReplyCommentId === commentId ? null : commentId;
    },
    
    async deleteComment(commentId, password) {
      if (!password) {
          alert('비밀번호를 입력해 주세요.');
          return;
      }
      try {
          const response = await axios.delete(`http://3.39.161.55:8000/api/comments/${commentId}/`, {
              data: { password: password }
          });
          this.fetchComments(); // 댓글 및 대댓글 목록 새로 고침
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

<style>
.comment-form, .reply-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.comment-clickable {
  cursor: pointer;
}

.reply-form {
  display: flex;
  margin-left: 20px; /* 대댓글 폼 들여쓰기 */
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
}

.input-group {
  display: flex;
  gap: 10px;
}

.nickname-input, .password-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  max-width: 150px;
}

.comment-input .reply-input {
  flex: 2;
  min-height: 100px;
  padding: 10px;
  font-size: 16px;
  resize: vertical;
}

.submit-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

.reply-submit-button {
  background-color: #c0eac1;
  border: none;
  color: rgb(0, 0, 0);
  padding: 8px 12px; 
  font-size: 14px; 
  cursor: pointer;
  width: auto; 
  align-self: flex-end; 
  margin-top: 10px; 
}

.reply-submit-button:hover {
  background-color: #a9d9a5; 
}

.comment-list {
  margin-top: 30px;
}

.comment-item {
  border-bottom: 1px solid #ddd; /* 댓글 간 구분선 */
  padding: 10px 0;
  position: relative;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.replies .comment-header,
.replies .comment-content {
  margin-left: 10px;
}

.replies .comment-item {
  background-color: #e6e6e673;
  margin-top: 5px;
}

.comment-info {
  display: flex;
  align-items: center;
}

.comment-date {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-content {
  margin-top: 5px;
}

.delete-button {
  background: none;
  border: none;
  color: #f44336;
  font-size: 0.9em;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.delete-button:hover {
  color: #d32f2f;
}

.password-input-group {
  display: flex; 
  align-items: end;
  width: auto;  
  position: absolute;
  top: 35px; 
  right: 0; 
  z-index: 10;

  /* 강제로 보이게 하는 스타일 */
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.password-input {
  flex: 1;
  padding: 5px;
  font-size: 14px;
  align-items: center;
}

.submit-delete-button {
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  align-items: center;
}
</style>
