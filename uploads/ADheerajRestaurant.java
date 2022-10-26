import java.util.Scanner;

public class ADheerajRestaurant {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int k = 1; k <= t; k++) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int c = sc.nextInt();
            int ans=0;

            if(a!=0){
                a--;
                ans++;
            }

            if(b!=0){
                b--;
                ans++;
            }

            if(c!=0){
                c--;
                ans++;
            }

            if(a==1 && b==1 && c!=0){
                a--;
                c--;
                ans++;
            }
            if(b==1 && c==1 && a!=0){
                a--;
                b--;
                ans++;
            }
            if(a==1 && c==1 && b!=0){
                c--;
                b--;
                ans++;
            }




            if(a!=0 && b!=0){
//                if(c>=1) {
                    a--;
                    b--;
                    ans++;
//                }
            }

            if(b!=0 && c!=0){
//                if(a>=1) {
                    b--;
                    c--;
                    ans++;
//                }
            }

            if(a!=0 && c!=0){
//                if(b>=1) {
                    a--;
                    c--;
                    ans++;
//                }
            }

            if(a!=0 && b!=0 && c!=0) {
                a--;
                b--;
                c--;
                ans++;
            }



            System.out.println(ans);
        }
    }
}
