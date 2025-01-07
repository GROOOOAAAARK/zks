mod pub_key;
use pub_key::{PubKey};

fn main(
    field_message: [u8; 32],
    field_signature: [u8; 64],
    field_pub_key: [u8; 64],
    field_total_balance: Field,
    field_solvency: pub Field
) {
    let total_balance = field_total_balance as i64;
    let solvency = field_solvency as i64;

    verify_solvency(total_balance, solvency);

    let pub_key = PubKey::from_flattened(field_pub_key);

    assert(pub_key.verify_signature(field_signature, field_message));
}

fn verify_solvency(balance: i64, solvency: i64) {
    assert(balance >= solvency);
}
