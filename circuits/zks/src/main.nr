fn main(fieldTotalBalance: Field, fieldSolvency: pub Field) {
    let balance: i64 = fieldTotalBalance as i64;
    let solvency: i64 = fieldSolvency as i64;

    assert(balance >= solvency);
}

#[test]
fn test_main() {
    main(1000, 500);
}
