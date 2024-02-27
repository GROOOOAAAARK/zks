use dep::std;
use dep::ecrecover;

fn main(
    field_message: [u8; 32],
    field_signature: [u8; 64],
    field_pub_key: [u8; 64],
    field_total_balance: Field,
    field_solvency: pub Field
) {
    let message = field_message;
    let signature = field_signature;
    let pub_key = field_pub_key;
    let total_balance = field_total_balance as i64;
    let solvency = field_solvency as i64;

    verify_signature(message, signature, pub_key);

    verify_solvency(total_balance, solvency);
}

fn verify_signature(message: [u8; 32], signature: [u8; 64], pub_key: [u8; 64]) {
    let key = ecrecover::secp256k1::PubKey::from_unified(pub_key);

    assert(key.verify_sig(signature, message));
}

fn verify_solvency(balance: i64, solvency: i64) {
    assert(balance >= solvency);
}
