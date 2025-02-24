# ERD

| Users         | Roles  | Projects     | OKRs         |
| ------------- | ------ | ------------ | ------------ |
| - id          | - id   | - id         | - id         |
| - username    | - name | - name       | - name       |
| - email       |        | - parent_id  | - parent_id  |
| - is_verified |        | - label      | - project_id |
| - role_id     |        | - manager_id | - manager_id |
|               |        |              | - start_date |
|               |        |              | - end_date   |
|               |        |              | - progress   |

| UserRoles | ProjectAssignments | OKRAssignments | OKRKeyResults | Comments  |
| --------- | ------------------ | -------------- | ------------- | --------- |
| - user_id | - project_id       | - okr_id       | - okr_id      | - id      |
| - role_id | - user_id          | - user_id      | - progress    | - okr_id  |
|           | - role             |                | - deadline    | - content |

| Deliverables | DeliverableAssignments |
| ------------ | ---------------------- |
| - id         | - deliverable_id       |
| - name       | - okr_id               |
| - type       | - project_id           |
| - file_path  |                        |
| - link       |                        |

### 설명

1. **Users 테이블**: 사용자 정보를 저장합니다. 이메일 인증 여부를 나타내는 `is_verified` 필드가 포함되어 있으며, `role_id`를 통해 권한을 관리합니다.

2. **Roles 테이블**: 사용자 권한 정보를 저장합니다. (예: ADMIN, PROJECT_MANAGER 등)

3. **Projects 테이블**: 프로젝트 정보를 저장합니다. `parent_id`를 통해 자기 참조 구조로 하위 프로젝트를 구성할 수 있으며, 각 프로젝트는 `manager_id`를 통해 담당자를 가질 수 있습니다.

4. **OKRs 테이블**: 목표 및 결과 정보를 저장합니다. `parent_id`를 통해 하위 목표를 구성할 수 있으며, 각 OKR은 `start_date`와 `end_date`를 통해 기간을 가집니다. 하위 목표는 상위 목표의 기간을 넘을 수 없습니다. `progress` 필드를 통해 OKR의 진행률을 관리합니다.

5. **UserRoles 테이블**: 사용자와 권한 간의 관계를 나타내는 중간 테이블입니다. (이제 `Users` 테이블의 `role_id`로 대체 가능)

6. **ProjectAssignments 테이블**: 프로젝트와 사용자 간의 관계를 나타내는 중간 테이블입니다. 각 프로젝트에 여러 사용자를 할당할 수 있으며, `role` 필드를 통해 각 사용자가 프로젝트 내에서 맡고 있는 역할이나 업무를 지정할 수 있습니다.

7. **OKRAssignments 테이블**: OKR과 사용자 간의 관계를 나타내는 중간 테이블입니다. 각 OKR에 여러 사용자를 할당할 수 있습니다.

8. **OKRKeyResults 테이블**: 각 목표의 Key Result와 진행률을 저장합니다.

9. **Comments 테이블**: 목표에 대한 코멘트를 저장합니다.

10. **Deliverables 테이블**: 산출물 정보를 저장합니다. `name` 필드를 통해 산출물의 이름을 지정할 수 있으며, `type` 필드를 통해 산출물이 파일인지 링크인지를 구분하고, `file_path`와 `link` 필드를 통해 각각의 정보를 저장합니다.

11. **DeliverableAssignments 테이블**: 산출물과 OKR, 프로젝트 간의 관계를 나타내는 중간 테이블입니다. 각 산출물을 여러 OKR이나 프로젝트에 연결할 수 있습니다.

이 ERD는 요구사항에 맞춰 각 테이블 간의 의존도를 낮추고, 중간 테이블을 통해 관계를 관리할 수 있도록 설계되었습니다. 프로젝트와 OKR의 관계, 사용자 인증 및 권한 관리, 목표의 기간 제한, OKR에 사용자 할당 기능, 그리고 산출물 저장 및 연결 기능을 반영하였습니다.
