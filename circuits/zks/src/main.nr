mod pub_key;
use pub_key::{PubKey};

fn main(
    field_message: [u8; 32],
    field_signature: [u8; 64],
    field_pub_key: [u8; 64],
    field_total_balance: i64,
    field_solvency: pub i64,
) {

    let is_solvency_valid = verify_solvency(field_total_balance, field_solvency);

    assert(is_solvency_valid == true, "Solvency is not valid");

    let pub_key = PubKey::from_flattened(field_pub_key);

    assert(pub_key.verify_flatten_signature(field_signature, field_message), "Signature is not valid");
}

fn verify_solvency(balance: i64, solvency: i64) -> bool {
    (balance >= solvency)
}

    let pub_key = PubKey::from_flattened(field_pub_key);

    assert(pub_key.verify_signature(field_signature, field_message));
}

fn verify_solvency(balance: i64, solvency: i64) {
    assert(balance >= solvency);
}
