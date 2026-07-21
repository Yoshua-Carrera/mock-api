use axum::{Json, http::StatusCode};
use serde::Serialize;
use tracing::info;

#[derive(Serialize)]
pub struct User {
    id: u64,
    username: String,
}

pub async fn handle_rest_request() -> (StatusCode, Json<User>) {
    info!("Hello World");

    let user = User {
        id: 1337,
        username: "username".to_string(),
    };

    (StatusCode::CREATED, Json(user))
}
