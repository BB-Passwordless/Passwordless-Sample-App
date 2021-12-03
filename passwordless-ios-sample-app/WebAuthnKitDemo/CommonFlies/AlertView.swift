//
//  AlertView.swift
//  CustomAlert
//
//  Created by SHUBHAM AGARWAL on 31/12/18.
//  Copyright © 2018 SHUBHAM AGARWAL. All rights reserved.
//

import Foundation
import UIKit

@objc protocol AlertViewDelegate{
    func alertViewRemoved()
}

class AlertView: UIView {

    static let alertView = AlertView()
    var alertViewDelegate: AlertViewDelegate?
    
    @IBOutlet var parentView: UIView!
    @IBOutlet weak var alertView: UIView!
    @IBOutlet weak var img: UIImageView!
    @IBOutlet weak var messageLbl: UILabel!
    @IBOutlet weak var doneBtn: UIButton!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        Bundle.main.loadNibNamed("AlertView", owner: self, options: nil)
        self.alpha = 0.5;
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        
        fatalError("init(coder:) has not been implemented")
    }
    
    private func commonInit() {
        //img.layer.cornerRadius = 30
//        img.layer.borderColor = UIColor.white.cgColor
//        img.layer.borderWidth = 2
        alertView.layer.cornerRadius = 4
        doneBtn.layer.cornerRadius = 4
        parentView.frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
        parentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        
    }
    
    enum AlertType {
        
        case success
        case failure
        case warning
        
    }
    
    enum ButtonType {
           case cancel
           case ok
           case Success
       }
    
    func showAlert(message: String, imageName:String,btnTitle:ButtonType) {

        self.messageLbl.text = message
         img.image = UIImage(named: imageName)
        
        if(btnTitle == ButtonType.ok)
        {
            //doneBtn.backgroundColor = UIColor.init(hexaRGB: "2C32BE")
            doneBtn.setTitleColor(UIColor.white, for: .normal)
            doneBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
       
        }else if(btnTitle == ButtonType.cancel){
            doneBtn.backgroundColor = UIColor.white
           // doneBtn.setTitleColor(UIColor.init(hexaRGB:"2C32BE"), for: .normal)
            doneBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
        }else{
           // doneBtn.backgroundColor = UIColor.init(hexaRGB: "2C32BE")
            doneBtn.setTitleColor(UIColor.white, for: .normal)
            doneBtn.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
        }

        UIApplication.shared.keyWindow?.addSubview(parentView)

    }

    @IBAction func onClickDone(_ sender: Any) {
        
        parentView.removeFromSuperview()
        alertViewDelegate?.alertViewRemoved()
    }

    
}

extension UIColor{
    static let success = UIColor(red: 55.0/255.0, green: 227.0/255.0, blue: 74.0/255.0, alpha: 1.0)
    static let failed = UIColor(red: 250.0/255.0, green: 17.0/255.0, blue: 0.0/255.0, alpha: 1.0)
    static let Warning = UIColor(red: 55.0/255.0, green: 227.0/255.0, blue: 74.0/255.0, alpha: 1.0)
}

