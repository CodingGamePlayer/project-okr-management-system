# 사용자 관리 테스트 케이스

## 1. 사용자 생성 (POST /users)

### 1.1. 정상 케이스

- **설명**: 올바른 데이터로 새로운 사용자 생성
- **입력**:
  ```json
  {
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }
  ```
- **예상 결과**:
  - 상태 코드: 201
  - 응답: 생성된 사용자 정보 (비밀번호 제외)

### 1.2. 중복 사용자 케이스

- **설명**: 이미 존재하는 이메일 또는 사용자명으로 생성 시도
- **입력**: 기존 사용자와 동일한 이메일/사용자명
- **예상 결과**:
  - 상태 코드: 409
  - 에러 메시지: "User already exists"

### 1.3. 유효성 검사 실패 케이스

- **설명**: 잘못된 형식의 데이터로 생성 시도
- **테스트 항목**:
  - 이메일 형식 오류
  - 비밀번호 길이 미달
  - 필수 필드 누락
- **예상 결과**:
  - 상태 코드: 400
  - 상세 유효성 검사 오류 메시지

## 2. 사용자 목록 조회 (GET /users)

### 2.1. 정상 케이스

- **설명**: 전체 사용자 목록 조회
- **예상 결과**:
  - 상태 코드: 200
  - 응답: 사용자 목록 배열 (역할 정보 포함)

## 3. 특정 사용자 조회 (GET /users/:id)

### 3.1. 정상 케이스

- **설명**: 존재하는 사용자 ID로 조회
- **예상 결과**:
  - 상태 코드: 200
  - 응답: 해당 사용자의 상세 정보

### 3.2. 존재하지 않는 사용자 케이스

- **설명**: 존재하지 않는 ID로 조회
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "User with ID {id} not found"

## 4. 사용자 정보 수정 (PATCH /users/:id)

### 4.1. 정상 케이스

- **설명**: 기존 사용자 정보 수정
- **입력 예시**:
  ```json
  {
    "username": "newusername",
    "password": "newpassword123"
  }
  ```
- **예상 결과**:
  - 상태 코드: 200
  - 응답: 수정된 사용자 정보

### 4.2. 존재하지 않는 사용자 케이스

- **설명**: 존재하지 않는 ID로 수정 시도
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "User with ID {id} not found"

## 5. 사용자 삭제 (DELETE /users/:id)

### 5.1. 정상 케이스

- **설명**: 존재하는 사용자 삭제
- **예상 결과**:
  - 상태 코드: 204
  - 응답: 없음

### 5.2. 존재하지 않는 사용자 케이스

- **설명**: 존재하지 않는 ID로 삭제 시도
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "User with ID {id} not found"

## 6. 이메일 인증 (POST /users/:id/verify)

### 6.1. 정상 케이스

- **설명**: 사용자 이메일 인증 처리
- **예상 결과**:
  - 상태 코드: 200
  - 응답: 인증 상태가 업데이트된 사용자 정보

### 6.2. 존재하지 않는 사용자 케이스

- **설명**: 존재하지 않는 ID로 인증 시도
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "User with ID {id} not found"

## 7. 역할 할당 (POST /users/:userId/roles/:roleId)

### 7.1. 정상 케이스

- **설명**: 사용자에게 역할 할당
- **예상 결과**:
  - 상태 코드: 200
  - 응답: 업데이트된 사용자 정보 (할당된 역할 포함)

### 7.2. 존재하지 않는 사용자 케이스

- **설명**: 존재하지 않는 사용자 ID로 역할 할당 시도
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "User with ID {userId} not found"

### 7.3. 존재하지 않는 역할 케이스

- **설명**: 존재하지 않는 역할 ID로 할당 시도
- **예상 결과**:
  - 상태 코드: 404
  - 에러 메시지: "Role with ID {roleId} not found"
