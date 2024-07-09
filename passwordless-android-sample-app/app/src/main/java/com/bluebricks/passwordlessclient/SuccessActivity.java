package com.bluebricks.passwordlessclient;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

public class SuccessActivity extends AppCompatActivity {

    TextView tvMsg;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_success);

        tvMsg=findViewById(R.id.tvMsg);

        String from= getIntent().getStringExtra("from");

        if(from==null)
            from="Error";
        else     if(from.equals("R"))
            from="Registration done successfully.";
        else     if(from.equals("L"))
            from="Login done successfully.";

        tvMsg.setText(""+from);
    }
}