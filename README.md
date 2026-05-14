# 🏋️ GymRat - 운동 일지 앱
 
> 나만의 운동 루틴을 기록하고 관리하는 웹 애플리케이션
 
🔗 **배포 URL**: [https://dailylift.duckdns.org](https://dailylift.duckdns.org)
 
---
 
## 📌 주요 기능

### 🏠 홈 대시보드
- 이번 주 요일별 운동 완료 여부 표시 (✅/❌) 및 연속 운동 streak 🔥
- 오늘의 루틴 목록 + 최근 메모 확인
- 최근 완료한 운동 5개 미리보기

### 🏋️ 운동 관리
- 운동 목록 조회 및 검색
- 운동별 상세 정보 (분류, 권장 세트수, 설명, 이미지)
- 루틴 등록 및 관리

### 📋 운동 기록
- 운동 완료 시 세트/횟수 기록 및 메모
- 달력으로 날짜별 운동 완료 여부 확인, 날짜 클릭 시 해당일 루틴 조회
- 월별 차트, 부위별 파이차트로 운동 통계 시각화
- 운동 완료 시 포인트 자동 적립

### ⏱ 운동 타이머
- 세트 간 휴식 타이머 (1초 단위 카운트다운, 자동 초기화)

### 👤 마이페이지
- BMI / BMR 자동 계산
- 신체 기록 (체중, 키, 체지방률, 근육량) 관리
- 포인트 적립 내역 조회

### 💬 리뷰 & Q&A
- 운동별 리뷰 작성 및 별점
- 관리자와 1:1 문의 및 답변 확인

### 🛠 관리자 페이지
- 운동 추가 / 수정 (제목, 출처, 분류, 설명, 권장 세트수, 이미지)
- 사용자 Q&A 답변 관리
---
 
## 🛠 기술 스택
 
### Backend
| 기술 | 버전 |
|------|------|
| Java | 17 |
| Spring Boot | 3.5.9 |
| Spring Security (OAuth2) | 3.0.6 |
| JPA / Hibernate | - |
| MySQL | 8.0.44 |
 
### Frontend
| 기술 | 버전 |
|------|------|
| React | 18.2.0 |
| TypeScript | 4.8.4 |
| Bootstrap | 5.3.8 |
| Auth0 React SDK | 2.11.0 |
 
### Infra & Auth
| 기술 | 용도 |
|------|------|
| AWS EC2 | 서버 배포 |
| Nginx | 리버스 프록시 |
| Let's Encrypt | SSL 인증서 |
| Auth0 | 소셜 로그인 / JWT 인증 |
 
---
 
## 🗄 DB 테이블 구조
<img width="700" alt="Image" src="https://github.com/user-attachments/assets/dda139c7-e520-4be4-87a6-ab106f5d226e" />
 
---
 
## 🔐 인증 방식
 
- **Auth0** 기반 소셜 로그인
- JWT 토큰을 Spring Security에서 검증 (`oauth2ResourceServer`)
- 로그인 성공 시 `user_profile` 자동 생성

---

## 📸 스크린샷
 
> GIF 및 스크린샷 추후 추가 예정
