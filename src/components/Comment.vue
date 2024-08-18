<template>
    <div>
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-info">{{ comment.nickname }} ({{ comment.ip }})</span>
            <span class="comment-date">
              {{ comment.date }}
              <button class="delete-button" @click="deleteComment(comment.id)">x</button>
            </span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>
      <br>
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
    data() {
    return {
      nickname: '',
      password: '',
      content: '',
      comments: [
            {
            id: 1,
            nickname: 'user1',
            password: 'password1',
            content: '첫 번째 댓글입니다.',
            ip: '127.0.0.1',
            date: '2024. 8. 18. 오후 3:49:40'
            },
            {
            id: 2,
            nickname: 'user2',
            password: 'password2',
            content: '두 번째 댓글입니다.',
            ip: '127.0.0.1',
            date: '2024. 8. 18. 오후 3:49:40'
            }
            ]
        };
    },
    methods: {
    async fetchIpAddress() {
        try {
            // IPv4 API 시도
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.warn('IPv4 API failed, trying IPv6:', error);
            try {
                // IPv4 실패 시 IPv6 API 시도
                const response = await axios.get('https://api64.ipify.org?format=json');
                return response.data.ip;
            } catch (error) {
                console.error('Failed to fetch IP address:', error);
                return 'unknown'; // IP 주소를 가져오는 데 실패한 경우
            }
        }
    },
    
    async submitComment() {
        if (!this.nickname || !this.password || !this.content) {
          alert('모든 필드를 입력해 주세요.');
          return;
        }
        try {
          const ipAddress = await this.fetchIpAddress();
          await axios.post(this.apiUrl, {
            nickname: this.nickname,
            password: this.password,
            content: this.content,
            ip: ipAddress,
            date: new Date().toLocaleString()
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
          this.comments = response.data;
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
    },
    
    async deleteComment(comment) {
        const password = prompt('댓글 삭제를 위한 비밀번호를 입력해 주세요:');
        if (!password) {
            return; // 비밀번호가 입력되지 않은 경우
        }
        try {
            const ipAddress = await this.fetchIpAddress();
            if (password === comment.password && ipAddress === comment.ip) {
                await axios.delete(`${this.apiUrl}/${comment.id}`);
                this.fetchComments(); // 댓글을 새로고침
            } else {
                alert('비밀번호가 일치하지 않거나 댓글 작성자가 아닙니다. 댓글을 삭제할 수 없습니다.');
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
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
  </style>