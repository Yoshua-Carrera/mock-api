use axum::{Json, extract::Path, http::StatusCode};
use serde_json::{Value, json};
use tracing::info;

pub async fn handle_rest_request(Path(path): Path<String>) -> (StatusCode, Json<Value>) {
    info!("Hello World");
    info!("{}", path);

    let path = format!("mock/{}", path);

    let mock = json!({ "path": path });

    (StatusCode::CREATED, Json(mock))
}
