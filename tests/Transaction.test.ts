/**
 *  Test of Transaction
 *
 *  Copyright:
 *      Copyright (c) 2022 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import * as ethers from "ethers";
import { hashFull, Transaction } from "../src";

import * as assert from "assert";

describe("Transaction", () => {
    // The test codes below compare with the values calculated in Agora.
    it("Test for hash value of transaction data", () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );

        assert.strictEqual(
            hashFull(tx).toString(),
            "0x133f17377fc8dd6727afc80ac5428bac832deef8939c4c994c4bbc2806ed6715"
        );
    });

    it("Test for Transaction.clone()", () => {
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );

        const clone_tx = tx.clone();
        assert.deepStrictEqual(tx, clone_tx);
    });

    it("Test for Transaction.sign() & verify", async () => {
        const signer1 = new ethers.Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
        const signer2 = new ethers.Wallet("0x023beec95e3e47cb5b56bb8b5e4357db4b8565aef61eaa661c11ebbac6a6c4e8");
        const tx = new Transaction(
            "12345678",
            "0x064c9Fc53d5936792845ca58778a52317fCf47F2",
            "0",
            BigInt(123),
            1668044556,
            "997DE626B2D417F0361D61C09EB907A57226DB5B",
            "a5c19fed89739383"
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0x6efdd7fcf30b0dabafbbac989924fb01c90030e3cb2c4226ae0a81bce84b7afb046a4b77bc675a362e52a1cbc75f95ad132296f6f6b57b38465505bb1a0a7b551b"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0x54cc9d609b85b60c881cc0078171109822a101a751c7159110e4b94ec14dc45f670133581cf938378ab56b5918d5c1bb5b205128c6e0ab736f5e3730aaee915b1b"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
    });
});
