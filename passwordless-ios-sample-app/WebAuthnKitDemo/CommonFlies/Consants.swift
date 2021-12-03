//
//  Consants.swift
//  WebAuthnKitDemo
//
//  Created by Ashwini on 14/05/21.
//  Copyright © 2021 Lyo Kato. All rights reserved.
//

import Foundation
// MARK: - FIDOModal
struct FIDOModal: Codable {
    let challenge: String
    let rp: Rp
    let user: User
    let pubKeyCredParams: [PubKeyCredParam]
    let timeout: Int
    let attestation: String?
    let authenticatorSelection: AuthenticatorSelection
}

// MARK: - AuthenticatorSelection
struct AuthenticatorSelection: Codable {
    let userVerification: String
    let requireResidentKey: Bool
}

// MARK: - PubKeyCredParam
struct PubKeyCredParam: Codable {
    let alg: Int
    let type: String
}

// MARK: - Rp
struct Rp: Codable {
    let name, id: String
}

// MARK: - User
struct User: Codable {
    let id, name, displayName: String
}


// MARK: - AssertionModal
struct AssertionModal: Codable {
    let challenge: String
    let allowCredentials: [AllowCredential]
    let timeout: Int
    let userVerification, rpID: String

    enum CodingKeys: String, CodingKey {
        case challenge, allowCredentials, timeout, userVerification
        case rpID = "rpId"
    }
}

// MARK: - AllowCredential
struct AllowCredential: Codable {
    let id, type: String
    let transports: [String]
}
