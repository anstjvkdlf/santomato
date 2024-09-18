<template>
    <div>
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
            <span class="comment-info">{{ comment.nickname }} ({{ maskIp(comment.ip) }})</span>
            <span class="comment-date">
                {{ formatDate(comment.date) }}
                <button class="delete-button" @click="togglePasswordInput(comment.id)">x</button>
            </span>
            </div>
            <div class="comment-content" @click="toggleReplyInput(comment.id)">
                {{ comment.content }}
            </div>
            <div v-if="comment.showPasswordInput" class="password-input-group">
                <input v-model="comment.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                <button class="submit-delete-button" @click="deleteComment(comment.id, comment.password)">삭제</button>
            </div>
            
            <!-- 댓글에 대한 대댓글 작성 폼 -->
            <div v-if="comment.showReplyInput" class="reply-form">
            <div class="input-group">
                <input v-model="comment.replyNickname" class="nickname-input" placeholder="닉네임" />
                <input v-model="comment.replyPassword" class="password-input" type="password" placeholder="비밀번호" />
            </div>
            <textarea v-model="comment.replyContent" class="reply-input" placeholder="대댓글 내용"></textarea>
            <button class="reply-submit-button" @click="submitReply(comment.id, comment.replyNickname, comment.replyPassword, comment.replyContent)">대댓글 등록</button>
            </div>


            <!-- 대댓글 표시 -->
            <div class="replies" v-if="comment.replies && comment.replies.length">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                    <div class="comment-header">
                    <span class="comment-info">{{ reply.nickname }} ({{ maskIp(reply.ip) }})</span>
                    <span class="comment-date">
                        {{ formatDate(reply.date) }}
                        <button class="delete-button" @click="toggleReplyPasswordInput(comment.id, reply.id)">x</button>
                    </span>
                    </div>
                    <div class="comment-content">{{ reply.content }}</div>
                    <div v-if="reply.showPasswordInput" class="password-input-group">
                        <input v-model="reply.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                        <button class="submit-delete-button" @click="deleteReply(comment.id, reply.id, reply.password)">삭제</button>
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
      comments: [
      {
        id: 1,
        nickname: 'User1',
        content: '첫 번째 댓글입니다.',
        ip: '127.0.0.1',
        date: '2024. 09. 08. 15:30:45',
        replies: [
          { id: 101, 
            nickname: 'ReplyUser1', 
            content: '첫 번째 대댓글입니다.', 
            ip: '192.168.0.1', 
            date: '2024-09-08 15:30:45', 
            },
          { id: 102, 
            nickname: 'ReplyUser2', 
            content: '두 번째 대댓글입니다.', 
            ip: '192.168.0.2', 
            date: '2024-09-08 16:30:45', 
            }
        ],
      },
      {
        id: 2,
        nickname: 'User2',
        content: '두 번째 댓글입니다.',
        ip: '127.0.0.1',
        date: '2024. 09. 08. 15:30:45',
        replies: [
          { id: 103, nickname: 'ReplyUser3', content: '세 번째 대댓글입니다.', ip: '192.168.0.3', date: '2024-09-08 17:30:45', showPasswordInput: false }
        ],
        showPasswordInput: false, 
        showReplyInput: false,
        replyNickname: '',
        replyPassword: '',
        replyContent: ''
      },
      {
        id: 3,
        nickname: 'User3',
        content: '세 번째 댓글입니다.',
        ip: '127.0.0.1',
        date: '2024. 09. 08. 15:30:45',
        replies: [],
        showPasswordInput: false, 
        showReplyInput: false,
        replyNickname: '',
        replyPassword: '',
        replyContent: ''
      }
    ],
    };
  },
  computed: {
    apiUrl() {
        return `http://3.39.161.55:8000/api/comments/mountain/${this.id}/`;
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
            });
            this.fetchComments(); // 댓글을 새로고침
            this.nickname = '';
            this.password = '';
            this.content = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    },

    async fetchComments() {
        try {
            const response = await axios.get(this.apiUrl);
            
            this.comments = response.data.map(comment => ({
            ...comment,
            showPasswordInput: false, 
            showReplyInput: false,  
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

    togglePasswordInput(commentId) {
      this.comments = this.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, showPasswordInput: !comment.showPasswordInput }
          : comment
      );
    },

    toggleReplyInput(commentId) {
      this.comments = this.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplyInput: !comment.showReplyInput }
          : comment
      );
    },

    toggleReplyPasswordInput(commentId, replyId) {
    this.comments = this.comments.map(comment => {
      if (comment.id === commentId) {
        comment.replies = comment.replies.map(reply => {
          if (reply.id === replyId) {
            reply.showPasswordInput = !reply.showPasswordInput;
          }
          return reply;
        });
      }
      return comment;
    });
  },


    async deleteComment(commentId, password) {
        if (!password) {
            alert('비밀번호를 입력해 주세요.');
            return;
        }
        try {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                const response = await axios.delete(`http://3.39.161.55:8000/api/comments/${commentId}/`, {
                data: { password: password }
                });
                this.fetchComments(); // 댓글을 새로고침
                alert(`${response.data.message}`);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`삭제 실패: ${error.response.data.message}`);
            } else {
                console.error('Failed to delete comment:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
        }
    },
    

    async submitReply(commentId, nickname, password, content) {
        if (!nickname || !password || !content) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }
        if (password.length < 4) {
            alert('비밀번호를 4자 이상으로 입력해주세요.');
            return;
        }
        try {
            await axios.post(`${this.apiUrl}${commentId}/reply/`, {
                nickname: nickname,
                password: password,
                content: content,
                date: new Date().toLocaleString('ko-KR'),
            });
            this.fetchComments();
        } catch (error) {
            console.error('Failed to submit reply:', error);
        }   
    },
  
    async deleteReply(commentId, replyId, password) {
        if (!password) {
            alert('비밀번호를 입력해 주세요.');
            return;
        }
        try {
            const comment = this.comments.find(c => c.id === commentId);
            if (comment) {
                const reply = comment.replies.find(r => r.id === replyId);
                if (reply) {
                    const response = await axios.delete(`http://3.39.161.55:8000/api/comments/${commentId}/reply/${replyId}/`, {
                        data: { password: password }
                    });
                    this.fetchComments(); // 댓글과 대댓글을 새로고침
                    alert(`${response.data.message}`);
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(`삭제 실패: ${error.response.data.message}`);
            } else {
                console.error('Failed to delete reply:', error);
                alert('대댓글 삭제 중 오류가 발생했습니다.');
            }
        }
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

.reply-item {
  background-color: #e6e6e673;
  margin-left: 20px; /* 대댓글 들여쓰기 */
  padding: 10px 0;
  border-bottom: 1px solid #ddd; /* 대댓글 간 구분선 */
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
