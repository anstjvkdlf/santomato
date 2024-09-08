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
            <div class="comment-content">{{ comment.content }}</div>

            <div v-if="comment.showPasswordInput" class="password-input-group">
                <input v-model="comment.password" class="password-input" type="password" placeholder="비밀번호 입력" />
                <button class="submit-delete-button" @click="deleteComment(comment.id, comment.password)">삭제</button>
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
      comments: []
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
          showPasswordInput: false, // 비밀번호 입력 필드 기본적으로 숨김
          password: '' // 삭제 비밀번호 초기화
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

  created() {
    this.fetchComments();
  }
}
</script>

  <style scoped>
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  .input-group {
    display: flex;
    gap: 10px;
  }
  .nickname-input, .password-input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
  }
  .nickname-input {
    max-width: 150px;
  }
  .password-input {
    max-width: 150px;
  }
  .comment-input {
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
  .comment-list {
    margin-top: 30px;
  }
  .comment-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    position: relative;
  }
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 날짜와 삭제 버튼을 수직 가운데 정렬 */
  }
  .comment-info {
    display: flex;
    align-items: center;
  }
  .comment-date {
    display: flex;
    align-items: center;
    gap: 10px; /* 날짜와 삭제 버튼 사이에 간격 추가 */
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
    align-items: center;
    position: absolute;
    right: 1px; /* Adjust right position */
    top: 35px; /* Adjust top position to be below the comment header */
    width: auto; /* Adjust width to fit content */
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